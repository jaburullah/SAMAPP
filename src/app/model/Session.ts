import {el} from '@angular/platform-browser/testing/src/browser_util';
import {Observable, of} from 'rxjs';

export class SessionModel {
  private _data;
  // private shouldRememberUserNameAndPassword;
  constructor() {
    this._data = {};
    this._data.email = getCookie('email');
    this._data.password = getCookie('password');
    this._data.hashKey = getCookie('hashKey');
    this._data.shouldRememberUserNameAndPassword = getCookie('rememberMe');
  }

  isUserLoggedIn() {
    return this._data.hashKey !== undefined;
  }

  clearSession() {
    if (this._data.shouldRememberUserNameAndPassword === 'false') {
      this._data = {};
      deleteACookie('email');
      deleteACookie('password');
      deleteACookie('hashKey');
      setACookie('rememberMe', false, 2);
    }
  }

  init(data) {
    this._data = data;
    setACookie('email', this._data.email, 2);
    setACookie('password', this._data.password, 2);
    setACookie('hashKey', this._data.hashKey, 2);
    setACookie('rememberMe', this._data.shouldRememberUserNameAndPassword, 2);
  }

  getHashKey() {
    return this._data && this._data.hashKey || '';
  }

  getEmail() {
    return this._data && this._data.email || '';
  }

  getPassword() {
    return this._data && this._data.password || '';
  }

  getLastVisited() {
    return this._data.lastVisited;
  }
  shouldRememberUserNameAndPassword() {
    return this._data.shouldRememberUserNameAndPassword;
  }
}

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays * 1000 * 60 * 60 * 24));
  const expires = 'expires=' + d.toUTCString();
  window.document.cookie = cname + '=' + cvalue + '; ' + expires;
}

function getCookie(cname) {
  const name = cname + '=';
  const cArr = window.document.cookie.split(';');
  for (let i = 0; i < cArr.length; i++) {
    const c = cArr[i].trim();
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
}

function deleteCookie(cname) {
  const d = new Date();
  d.setTime(d.getTime() - (1000 * 60 * 60 * 24));
  const expires = 'expires=' + d.toUTCString();
  window.document.cookie = cname + '=' + '; ' + expires;

}

function checkCookie(cname) {
  const cookie = getCookie(cname);
  if (cookie !== '') {
    return true;
  } else {
    return false;
  }
}

function setACookie(name, value, expiryDays) {
  const cname = name;
  const cvalue = value;
  const exdays = expiryDays;

  setCookie(cname, cvalue, exdays);
}

function deleteACookie(name) {
  const cname = name;
  deleteCookie(cname);
}

function disPlayAllCookies() {
  const cArr = window.document.cookie.split(';');
  for (let i = 0; i < cArr.length; i++) {
    console.log(cArr[i].trim());
  }
}
