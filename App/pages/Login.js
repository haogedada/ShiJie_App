import React, {Component} from 'react'
import {Text, View, TextInput, findNodeHandle, Dimensions, Image, StyleSheet, Button} from 'react-native'
import {BlurView} from 'react-native-blur';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
//网络请求
import {login} from '../netWork/api'
//请求网址
import {url} from "../constants/url"
import {Actions} from 'react-native-router-flux'
//网络请求后状态码的判断
import {isStatusCode} from '../netWork/StatusCode'
import Storage from '../util/AsyncStorageUtil'
//警告
import {prompt} from '../util/Warning'
let {width, height} = Dimensions.get("window")
class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //用户名
            userName: '',
            //密码
            passWord: '',
            //以下为测试使用的属性名
            url: "",
            str: '',
            viewRef: null
        };

    }

    imageLoaded() {
        this.setState({viewRef: findNodeHandle(this.backgroundImage)});
    }

    /**
     *用户登录处理函数
     * @param user 用戶名
     * @param pass 密码
     */
    async isInputEmpty(user, pass) {
        let warn = {};
        this.setState({url: url.URL_LOGIN})
        //判断用户点击登录后输入框是否为空
        if (user === "") {
            warn.title = "警告";
            warn.text = "用户名为空";
            prompt(warn);
            return;
        }
        if (pass === "") {
            warn.title = "警告";
            warn.text = "密码为空";
            prompt(warn);
            return;
        }
        //用户进行网络请求
        let black = login({
            username: user,
            password: pass
        })
        let loginInfo = await Storage.get("loginInfo");
        console.log("登录数据", loginInfo);
        isStatusCode(loginInfo)
        //用户点击登录后清空输入框中的值
        this.setState({
            userName: '',
            passWord: ''
        })
    }

    //render函数渲染
    render() {
        return (
            <KeyboardAwareScrollView>
                <View style={styles.container}>
                    <Image
                        style={styles.bg}
                        source={require('./../resources/images/image_backgrund/bg_2.jpg')}
                        ref={(img) => {
                            this.backgroundImage = img;
                        }}
                        onLoadEnd={this.imageLoaded.bind(this)}
                    />
                    <BlurView
                        style={styles.dark}
                        viewRef={this.state.viewRef}
                        blurType="light"
                        blurAmount={20}
                    />
                    <View style={styles.tgInputBox}>
                        <Image style={{width: 35, height: 35}} source={require('./../resources/images/icon/user.png')}/>
                        <TextInput style={styles.inputStyle} placeholder="用户名"
                                   onChangeText={(text) => this.setState({userName: text})}
                                   defaultValue={this.state.userName}/>
                    </View>
                    <View style={styles.tgInputBox}>
                        <Image style={{width: 35, height: 35}} source={require('./../resources/images/icon/word.png')}/>
                        <TextInput style={styles.inputStyle} password={true} placeholder="密码" secureTextEntry={true}
                                   onChangeText={(text) => this.setState({passWord: text})}
                                   defaultValue={this.state.passWord}/>
                    </View>
                    <View style={styles.tgLoginBtnStyle}>
                        <Button style={styles.tgLoginBtnStyle} onPress={
                            () => {
                                let user = this.state.userName;
                                let pass = this.state.passWord;
                                this.isInputEmpty(user, pass);
                            }
                        }
                                title='登              陆'/>
                    </View>
                    <View style={styles.tgSettingStyle}>
                        <Text>忘记密码</Text>
                        <Text onPress={() => Actions.Register()}>新用户</Text>
                    </View>
                </View>
            </KeyboardAwareScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: width,
        height: height - 70
    },
    inputStyle: {
        width: width * 0.62,
        height: 38,
        borderWidth: 1,
        borderColor: '#3d3d3d',
        marginBottom: 10,
        paddingLeft: 10,
        borderRadius: 4,
        textAlign: 'left',
        alignSelf: 'center'
    },
    tgLoginBtnStyle: {
        height: 38,
        width: width * 0.7,
        marginTop: 15,
        marginBottom: 10
    },
    tgSettingStyle: {
        flexDirection: 'row',
        width: width * 0.7,
        justifyContent: 'space-between'
    },
    tgInputBox: {
        flexDirection: 'row',
        width: width * 0.7,
        justifyContent: 'space-between'
    },
    bg: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: width,
        height: height
    },
    dark: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    },
})
export default Login;
