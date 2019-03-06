/*
 * Copyright (c) 2018 by Lưu Hiếu <tronghieu.luu@gmail.com>
 */
'use strict';

const winston = require('winston');
const util = require("util");
const format = winston.format;
const { combine, timestamp } = format;
const DailyRotateFile = require('winston-daily-rotate-file');

const MESSAGE = Symbol.for('message'),
  SPLAT = Symbol.for('splat');

class Logger {
  constructor (config) {
    this.options = Object.assign({
      filename: '%DATE%.log',
      datePattern: 'YYYY-MM-DD-HH',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d'
    }, config);
    this.optionsForLogAll = {...this.options} 
  }

  createLogger (channel) {
    if (channel) {
      this.options.filename = `${channel}-${this.options.filename}`;
    }
    let errorOption = Object.assign({}, this.options);
    errorOption.filename = `err-${errorOption.filename}`;

    let customFormat = format((info) => {
      let prefix = util.format('[%s] [%s]', info.timestamp, info.level.toUpperCase());
      if (info[SPLAT]) {
        for(let ii = 0; ii < info[SPLAT].length; ++ii) {
          if (info[SPLAT][ii] instanceof Error) {
            info['message'] = util.format('%s %s' ,info['message'], info[SPLAT][ii].stack) ;
          } else {
            info['message'] = util.format('%s %s' ,info['message'], JSON.stringify(info[SPLAT][ii])) ;
          }
        }
      }

      info[MESSAGE] = util.format('%s %s', prefix, info['message']);

      return info;
    });

    return winston.createLogger({
      level: this.options['level'],
      format: combine(
        timestamp(),
        // prettyPrint(),
        customFormat()
      ),
      transports: [
        // new winston.transports.Console(),
        new (DailyRotateFile)(this.options),
        new (DailyRotateFile)(this.optionsForLogAll)
      ]
    });
  }
}

module.exports = Logger;