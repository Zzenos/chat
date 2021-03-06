import io from 'weapp.socket.io';
import {
  getUuid,
} from '@/util/util.js';

const MAX_QUEUE_LENGTH = 10; // 最大消息队列长度，超过则认为出现消息问题或短期无法恢复
const MAX_RECONNECTION_ATTEMPTS = Infinity; // 最大重试次数 -1代表无限重试
const MSG_STATUS = {
  READY: 1,
  PENDING: 2,
  FAILED: 3,
};

const cs = function (str) {
  console.log(`%c ${str}`, 'color:#02feff;');
};

const defaultOptions = {
  timeout: 15000,
  reconnection: false,
};

class ZSocket {
  constructor(autoPull) {
    this.socket = null;
    this.autoPull = autoPull || true; // 断连自动拉取
    this.emitMsgs = [];
    this.receiveMsgs = []; // 重新拉取后的消息可能需要重新排序
    this.lastMessageId = null;
    this.tryReconnectAttempts = 0;
    this.tryReconnectTimer = null;
    return this;
  }

  /**
   * 初始化socket链接
   * @param {String} url
   * @param {Object} options
   */
  init = function (
    url,
    options = {},
  ) {
    if (this.socket) {
      this._disconnect();
    }
    options = Object.assign(
      defaultOptions,
      options,
    );
    options.query = options.query || {};
    options.query.id = getUuid();
    this.options = options;

    this.socket = io(url, {
      ...options,
    });
    this.socket.on('connect', () => {
      // 自动重发
      if (this.emitMsgs.length > 0) this._send();
      cs(`SOCKET链接成功,当前SOCKET_ID：${this.socket.id}`);
    });
    // 连接错误，服务端接受链接时的中间件发生错误，比如认证错误等
    this.socket.on('connect_error', (error) => {
      // 对于连接认证未成功
      if (error && error.code === 400) {
        cs(
          `连接认证未成功，错误：${error.message}`,
        );
        // log('连接认证未成功，错误：', error);
        return;
      }
      cs(
        `SOCKET链接发生错误,当前SOCKET_ID：${this.socket.id}，错误信息：${error.message}   ${new Date().getSeconds()}  ${this.socket.io.timeout()}`,
      );
      this._autoReconnect();
    });
    // 自动链接超时 默认20000ms
    this.socket.on('connect_timeout', (error) => {
      cs(
        `SOCKET链接超时,当前SOCKET_ID：${this.socket.id}，错误信息：${error.message}`,
      );
    });
    // 服务端断开自动重连
    this.socket.on('disconnect', (reason) => {
      // 断开时重置消息状态
      this._resetMsgs();
      if (reason === 'io client disconnect') {
        // 手动触发的断开将不会自动进行重连
        cs('客户端SOCKET链接主动断开，不会进行自动链接');
      } else if (reason === 'io server disconnect') {
        // the disconnection was initiated by the server, you need to reconnect manually
        cs('服务端SOCKET链接主动断开，不会进行自动链接');
      } else {
        cs('发生意外断开，将自动链接');
        this.reconnect();
      }
    });
    // 自动重连成功
    this.socket.on('reconnect', (attemptNumber) => {
      cs(`第${attemptNumber}次自动重连成功，当前SOCKET_ID：${this.socket.id}`);
      // 自动重连才会进行信息重新拉取
      if (this.autoPull && this.lastMessageId !== '') {
        // 这个emit不能使用拦截
        this.socket.emit('pull', {
          lastMessageId: this.lastMessageId,
        });
      }
    });

    this.socket.on('reconnect_error', (err) => {
      cs(`重连失败，当前SOCKET_ID：${JSON.stringify(err)}`);
    });

    // 自动重连
    this.socket.on('reconnecting', (attemptNumber) => {
      cs(`SOCKET已断开，正在尝试进行第${attemptNumber}次重连`);
      console.log(this.socket);
    });
    // 到达自动重连次数上线
    this.socket.on('reconnect_failed', () => {
      cs('已到达自动重连上限');
    });
    this.socket.on('error', (error) => {
      cs(
        `SOCKET发生错误，当前SOCKET_ID：${this.socket.id}，错误信息：${error.message}`,
      );
    });
  }

  /**
   * 提交事件
   * @param {String} evtName
   * @param {Array} args
   * @param {Function} ack
   */
  emit = function (evtName, ...args) {
    // if (this.socket && this.socket.connected) {
    if (this.socket) {
      // 为了兼容你妹的第一个参数不是对象或者未传递的情况
      if (typeof args[0] !== 'object') {
        // 基础库2.7.1以上
        // log.warn(`错误的提交参数 ${evtName}，参数：`, args);
        return;
      }

      // 因为约定了参数必须是单个对象，所以理论上最长是长度为2的数组
      if (args.length >= 1 && typeof args[0] === 'object') {
        args[0].requestId = getUuid();
        args[0]._status = MSG_STATUS.READY;
      }

      // 超出最大长度则熔断
      if (this.emitMsgs.length > MAX_QUEUE_LENGTH) this.emitMsgs = [];
      this.emitMsgs.push({
        evtName,
        args,
      });
      this._send();
    } else {
      const argsStr = args.length > 0 ? args.join('&') : '';
      cs(`emit方法调用失败，SOCKET未连接: 事件${evtName}，数据${argsStr}`);
    }
  };

  /**
   * emit和connect事件触发时都会触发，发送失败的情况只有链接断开
   * 发送成功后根据请求ID删除消息
   */

  _send = function () {
    console.error('zong', this.emitMsgs);
    for (let i = 0; i < this.emitMsgs.length; i++) {
      const msg = this.emitMsgs[i];
      // 是否传输中
      if (msg._status === MSG_STATUS.PENDING) continue;

      let cb = null;
      if (typeof msg.args[msg.args.length - 1] === 'function') {
        cb = msg.args.pop();
      }

      msg._status = MSG_STATUS.PENDING;

      this.socket.emit(msg.evtName, ...msg.args, (ack) => {
        const str = msg.args.map((j) => JSON.stringify(j));
        cs(
          `${msg.evtName}事件发送成功：${str.join(
            '===',
          )}, ACK: ${JSON.stringify(ack)}`,
        );
        if (ack) {
          const index = this.emitMsgs.findIndex((item) => item.args[0].requestId === ack.data
            .requestId);
          if (index >= 0) this.emitMsgs.splice(index, 1);
        }
        // 有回调
        if (cb && typeof cb === 'function') {
          cb(ack.data);
          cs('发送成功回调执行');
        }
      });
    }
  };

  /**
   * 注册事件回调
   * @param {String} evtName
   * @param {Function} cb
   */
  on = function (evtName, cb) {
    if (this.socket) {
      cs(`${evtName}事件的回调注册成功`);
      this.socket.on(evtName, (data) => {
        cs(`${evtName}事件回调成功, ${JSON.stringify(data)}`);
        if (data && this.autoPull) this.lastMessageId = data.id;
        if (cb && typeof cb === 'function') cb(data);
      });
    } else {
      cs(`注册事件${evtName}到on方法失败，缺失SOCKET实例`);
    }
  };

  /**
   * 关闭链接但不清除配置
   */
  close = function () {
    // 断链时sokcet.id == undefined
    if (this.socket) {
      try {
        this.socket.disconnect();
      } catch (e) {
        cs(`断开当前SOCKET发生错误，SOCKET_ID: ${this.socket.id}, 错误信息：${e.message}`);
      }
    }
  }

  /**
   * 使用当前配置重新链接
   */
  reconnect = function () {
    if (this.socket && !this.socket.connected) {
      this.socket.connect();
    }
  }

  /**
   * 如果小于尝试次数，自动再次尝试
   */
  _autoReconnect = function () {
    if (!this.socket) return;
    if (this.tryReconnectTimer) clearTimeout(this.tryReconnectTimer);
    if (MAX_RECONNECTION_ATTEMPTS === Infinity || this.tryReconnectAttempts <
      MAX_RECONNECTION_ATTEMPTS) {
      this.tryReconnectTimer = setTimeout(() => {
        cs(`SOCKET已断开，正在尝试进行第${this.tryReconnectAttempts}次重连`);
        this.socket.connect();
        this.tryReconnectAttempts++;
      }, 3000);
    }
  }

  /**
   *
   */
  _disconnect = function () {
    if (this.socket && this.socket.connected) {
      try {
        this.socket.disconnect();
      } catch (e) {
        cs(`断开当前SOCKET发生错误，SOCKET_ID: ${this.socket.id}, 错误信息：${e.message}`);
      } finally {
        this._resetSocket();
      }
    }
  }

  _resetSocket = () => {
    // 触发GC
    this.socket = null;
    this.emitMsgs = [];
    this.receiveMsgs = [];
    this.lastMessageId = null;
    this.tryReconnectAttempts = 0;
  }

  _resetMsgs = () => {
    this.emitMsgs.forEach((msg) => {
      if (msg._status === MSG_STATUS.PENDING) {
        msg._status = MSG_STATUS.READY;
      }
    });
  }
}

export default ZSocket;