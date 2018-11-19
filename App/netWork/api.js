import HttpUtil from './HttpUtil'
import {url} from '../constants/url'

export function getHome() {
    return HttpUtil.get(url.URL_USERHOME);
}

export function getCollections() {
    return HttpUtil.get(url.URL_COLLECTIONS);
}

export function getTypes() {
    return HttpUtil.get(url.URL_ALLVIDEOTYPE);
}

export function getVideoTypesCount(params) {
    return HttpUtil.get(url.URL_VIDEOTYPE, params);
}

export function updateInfo(parms) {
}

export function login(params) {
    return HttpUtil.post(url.URL_LOGIN, params);
}

export function register(params) {
    return HttpUtil.post(url.URL_REGISTER, params)
}

/**
 * 请求个人信息数据
 */
export function getUserInfo() {
    return HttpUtil.get(url.URL_USERMSG);
}

export function getVideo(params) {
    return HttpUtil.get(url.URL_VIDEO + "/" + params);
}

export function promptEmail(params) {
    return HttpUtil.get(url.URL_PROMPTEMAIL, params)
}

export function promptUserName(params) {
    return HttpUtil.get(url.URL_PROMPTNAME, params)
}

export function promptUserMsg() {
    return HttpUtil.get(url.URL_USERMSG)
}

export function modifyUserMsg(params) {
    return HttpUtil.upload(url.URL_MODIFYUSER, params)
}

export function getUserFansList() {
    return HttpUtil.get(url.URL_FANSLIST)
}

export function getUserFollowList() {
    return HttpUtil.get(url.URL_FOLLOWLIST)
}
export function upLoadVideo(params) {
    return HttpUtil.upload(url.URL_UPLOADVIDEO,params)
}
export function playerCountAdd(params){
    return HttpUtil.put(url.URL_PUT_PLAYERCOUNT+params) 
}
export function praiseVideo(params){
    return HttpUtil.put(url.URL_PUT_PRAISEVIDEO+params) 
}
export function trampleVideo(params){
    return HttpUtil.put(url.URL_PUT_TRAMPLEVIDEO+params) 
}
export function followUser(params){
    return HttpUtil.put(url.URL_PUT_FOLLOW+params) 
}