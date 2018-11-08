import React, { Component } from 'react'
import { Text, View, TextInput, StyleSheet, Button, Dimensions, Alert, Image } from 'react-native'
import { register, promptEmail, promptUserName } from '../netWork/api'
import { randomNumber } from '../util/random'
class Register extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username: '',
            password: '',
            okpassword: '',
            email: '',
            yzm: '',
            isRegister: false,
            prompt: ' ',
            random: randomNumber(),
            btn_disabled: true,
        }
    }
    render() {
        let prompt_str = [
            '用户名为长度3至20的英文字母',
            '密码为长度8至16的英文字符组合',
            '两次密码不匹配',
            '邮箱不合法',
            '邮箱已存在',
            '验证码不正确',
            '用户名已存在'
        ]
        /**
         * 注册事件
         * @param {*} e 
         */
        function btn_register(e) {
            if (!btn_disabled) {
                let form = {
                    username: this.state.username,
                    password: this.state.password,
                    email: this.state.email
                }
                register(form).then(response => {
                    if (response.code === 200) {
                        Alert.alert('注册成功')
                    } else if (response.code === 500) {
                        Alert.alert(response.msg)
                    }
                });
            } else {
                Alert.alert('请正确输入信息')
            }

        }
        /**
         * 
         * @param {验证邮箱是否存在} e 
         */
        function handleEmail(e) {
            const re = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
            if (!re.test(this.state.email)) {
                this.setState({ btn_disabled: true, prompt: prompt_str[3] });
            } else {
                let _email = { email: this.state.email }
                promptEmail(_email).then(response => {
                    if (response.code === 200) {
                        this.setState({ btn_disabled: true, prompt: prompt_str[4] });
                    } else {
                        this.setState({ prompt: ' ' });
                    }
                })
            }
        }
        /**
         * 用户名验证
         */
        function handleUserName(e) {
            const re = /[^A-Za-z]/;
            if (((3 > this.state.username.length) ||
                (this.state.username.length > 20))) {
                this.setState({ btn_disabled: true, prompt: prompt_str[0] });
            } else if (re.test(this.state.username)) {
                this.setState({ btn_disabled: true, prompt: prompt_str[0] });
            } else {
                if (this.state.username !== '  ') {
                    let _username = { username: this.state.username }
                    promptUserName(_username).then(response => {
                        console.log(response);

                        if (response.code === 200) {
                            this.setState({ btn_disabled: true, prompt: prompt_str[6] });
                        } else {
                            this.setState({ prompt: ' ' });
                        }
                    })
                } else {
                    this.setState({ btn_disabled: true, prompt: '用户名不能为空' });
                }
            }
        }
        /**
         * 
         * @param {表单参数验证} e 
         */

        function handlePrompt(e) {
            if ((8 > this.state.password.length) || (this.state.password.length > 16)) {
                this.setState({ btn_disabled: true, prompt: prompt_str[1] });
            } else if (this.state.password !== (this.state.okpassword)) {
                this.setState({ btn_disabled: true, prompt: prompt_str[2] });
            } else if ((this.state.yzm !== this.state.random.toLowerCase()) &&
                (this.state.yzm !== this.state.random.toUpperCase())) {
                this.setState({ btn_disabled: true, prompt: prompt_str[5] });
            } else {
                this.setState({
                    btn_disabled: false,
                    prompt: ' '
                });
            }
        }
        return (
            <View style={styles.column}>
                <View style={styles.row}>
                    <Image style={{width: 35, height: 35}} source={require('./../resources/images/icon/user.png')} />
                    <TextInput style={styles.input}
                        onChangeText={(value) => this.setState({ username: value })}
                        placeholder="请输入用户名"
                        onBlur={handleUserName.bind(this)} />
                </View>
                <View style={styles.row}>
                    <Image style={{width: 35, height: 35}} source={require('./../resources/images/icon/word.png')} />
                    <TextInput style={styles.input}
                        onChangeText={(value) => this.setState({ password: value })}
                        placeholder="请输入密码"
                        onBlur={handlePrompt.bind(this)}
                    />
                </View>
                <View style={styles.row}>
                    <Image style={{width: 35, height: 35}} source={require('./../resources/images/icon/word.png')} />
                    <TextInput style={styles.input}
                        onChangeText={(value) => this.setState({ okpassword: value })}
                        placeholder="请输入密码"
                        onBlur={handlePrompt.bind(this)} />
                </View>
                <View style={styles.row}>
                    <Image style={{width: 35, height: 35}} source={require('./../resources/images/icon/email.png')} />
                    <TextInput style={styles.input}
                        onChangeText={(value) => this.setState({ email: value })}
                        onBlur={handleEmail.bind(this)}
                        placeholder="请输入邮箱" />
                </View>
                <View style={styles.row}>
                    <View style={styles.yzmBox}>
                      <Text style={{fontSize: 20, textAlign: 'center', lineHeight: 36}} onPress={() => { this.setState({ random: randomNumber() }) }}>{this.state.random}</Text>
                    </View>
                     <TextInput style={[styles.input, styles.yzm]}
                        onChangeText={(value) => this.setState({ yzm: value })}
                        onBlur={handlePrompt.bind(this)}
                        placeholder="请输入验证码" />
                </View>
                <View style={styles.row}>
                    <Text style={styles.hint}>{this.state.prompt}</Text>
                </View>
                <View style={styles.row}>
                    <View style={styles.btn} >
                        <Button title="注           册" disabled={this.state.btn_disabled} style={styles.btn} onPress={btn_register.bind(this)} />
                    </View>
                </View>
            </View>
        )
    }
}

export default Register;

var { height, width } = Dimensions.get('window');
const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: width * 0.7
    },
    column: {
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    input: {
        height: 36,
        width: width * 0.6,
        padding: 0,
        borderWidth: 1,
        borderColor: "#3d3d3d",
        borderRadius: 4,
        paddingLeft: 10,
        marginBottom: 10,
    },
    btn: {
        width: width * 0.7,
        height: 36,
        marginTop: 25
    },
    hint: {
      color: 'red'
    },
    yzm: {
      width: 0.5 * width
    },
    yzmBox: {
      width: width * 0.18,
      height: 36,
      textAlign: 'center',
      backgroundColor: '#fff'
    }
});
