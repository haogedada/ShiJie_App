import React, { Component } from 'react'
import SYImagePicker from 'react-native-syan-image-picker'
import { modifyUserMsg, getUserInfo } from '../netWork/api'
import FileUtil from '../util/FileUtil'
import { Actions } from 'react-native-router-flux'
import ActionSheet from 'react-native-actionsheet'
import {
  Text, View, Image, TextInput, StyleSheet, Dimensions, TouchableOpacity,
  Button, Alert, DeviceEventEmitter
} from 'react-native'

var { height, width } = Dimensions.get('window');
class UserMsg extends Component {
  constructor(props) {
    super(props);
    this.state = {
      headerPath: this.props.headimgUrl ,
      nickname: this.props.userInfo.userNickname,
      sex:this.props.userInfo.userSex,
      birthday:this.props.userInfo.userBirthday,
      sign: this.props.userInfo.bardianSign,
      prompt: ' ',
      isSelect: false,
      progress: 0,
    }
    this.submitMsg = this.submitMsg.bind(this)
    this.handleSelectImg = this.handleSelectImg.bind(this)
    this.listenerUploadProgress = this.listenerUploadProgress.bind(this)
  }
  componentDidMount() {
    this.listenerUploadProgress()
  }
  componentWillUnmount() {
    DeviceEventEmitter.removeListener('uploadProgress')
  }
  listenerUploadProgress() {
    DeviceEventEmitter.addListener('uploadProgress', (_progress) => {
      this.setState({ progress: _progress })
    })
  }
  handleSelectImg() {
    let options = {
      imageCount: 1,// 最大选择图片数目
      isCamera: true,         // 是否允许用户在内部拍照，默认true
      isCrop: true,          // 是否允许裁剪，默认false
      CropW: ~~(width * 0.7), // 裁剪宽度，默认屏幕宽度60%
      CropH: ~~(width * 0.7), // 裁剪高度，默认屏幕宽度60%
      isGif: false,           // 是否允许选择GIF，默认false，暂无回调GIF数据
      showCropCircle: true,  // 是否显示圆形裁剪区域，默认false
      showCropFrame: true,    // 是否显示裁剪区域，默认true
      showCropGrid: true     // 是否隐藏裁剪区域网格，默认false
    }
    SYImagePicker.showImagePicker(options, (err, photos) => {
      if (!err) {
        this.setState({
          headerPath: photos,
          isSelect: true
        })
      } else {
        Alert.alert('你还没有选择图片')
        return
      }
    })
  }
  showProgressBar() {
    this.refs.RNProgressDialog && this.refs.RNProgressDialog.showProgressBar()
  }
  dissmissProgressBar() {
    this.refs.RNProgressDialog && this.refs.RNProgressDialog.dissmiss(0.5);
  }
  progressBarCancel() {
    this.dissmissProgressBar()
    return
  }
  submitMsg() {
    if (!this.state.prompt.includes(' ')) {
      Alert.alert('请正确输入表单')
      return
    }
    if (!this.state.isSelect) {
      Alert.alert('请选择照片')
      return
    } 
      var form = new FormData();
      form.append("nickname", this.state.nickname);
      form.append("sex", this.state.sex);
      form.append("birthday", this.state.birthday);
      if(this.state.isSelect){
        form.append('imgfile', FileUtil.creatFile(this.state.headerPath[0].uri, 'header'));
      }
      form.append("sign", this.state.sign);
      this.showProgressBar()
      modifyUserMsg(form).then(data => {
        if (data.code === 200) {
          Alert.alert('上传成功!!')
          this.dissmissProgressBar()
          DeviceEventEmitter.emit('login')
          this.setState({
            progress:0
          })
          Actions.me()  
        } else {
          Alert.alert(data.msg)
          this.setState({
            progress:0
          })
          this.dissmissProgressBar()
        }
      })
    
  }
  render() {
    return (
      <View style={styles.msg}>
        <View> 
          <TouchableOpacity onPress={this.handleSelectImg}
            style={styles.imageBox}>
            <Image
              source={this.state.headerPath}
              style={styles.imageStyle} />
          </TouchableOpacity>
        </View>
        <Text style={{ fontSize: 11 }}>点击修改头像</Text>
        <View style={styles.msg_item} >
          <Text style={styles.textStyle}>昵称:</Text>
          <TextInput defaultValue={this.state.nickname}
            style={styles.inputStyle}
            onChangeText={(value) => {
              if (value.includes(' ')) {
                this.setState({ prompt: '昵称不能为空' })
              }
              else { this.setState({ nickname: value, prompt: ' ' }) }
            }}
          />
        </View>
        <View style={styles.msg_item}>
          <Text style={styles.textStyle}>性别:</Text>
          <View style={styles.inputStyle}>
            <Text style={{ lineHeight: 38 }}
              onPress={() => { this.ActionSheet.show() }}>{this.state.sex}</Text>
          </View>
        </View>
        <View style={styles.msg_item}>
          <Text style={styles.textStyle}>年龄:</Text>
          <TextInput defaultValue={this.state.birthday}
            onChangeText={(value) => {
              if (value.includes(' ')) {
                this.setState({ prompt: '年龄不能为空' })
              } else {
                this.setState({ birthday: value, prompt: ' ' })
              }
            }
            }
            style={styles.inputStyle} />
        </View>
        <View style={[styles.msg_item, { marginBottom: 20 }]}>
          <Text style={styles.textStyle}>签名:</Text>
          <TextInput defaultValue={this.state.sign}
            onChangeText={(value) => {
              if (value.includes(' ')) {
                this.setState({ prompt: '签名不能为空' })
              } else { this.setState({ sign: value, prompt: ' ' }) }
            }}
            style={styles.inputStyle} />
        </View>
        <Text style={{ fontSize: 15, color: 'red', paddingBottom: 5, paddingTop: 5 }}>{this.state.prompt}</Text>
        <View style={{ width: 0.7 * width }}>
          <Button title="完成"
            onPress={this.submitMsg} />
        </View>
        <ActionSheet
          ref={o => this.ActionSheet = o}
          title={'选择'}
          options={['男', '女', '取消']}
          cancelButtonIndex={2}
          onPress={(index) => {
            let sex = this.ActionSheet.props.options[index]
            if (index !== 2) {
              this.setState({ sex })
            }
          }}
        />
        <RNProgressDialog ref='RNProgressDialog' content='上传中...'
          dissmissClick={() => { this.progressBarCancel() }} progress={this.state.progress}/>
      </View>
    )
  }
}
export default UserMsg
const styles = StyleSheet.create({
  msg: {
    flex: 1,
    flexDirection: "column",
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -150
  },
  imageStyle: {
    width: 80,
    height: 80,
    alignItems: 'center',
    borderRadius: 50
  },
  imageBox: {
    marginBottom: 10,

  },
  msg_item: {
    flexDirection: "row",
    width: 0.7 * width,
    marginBottom: 10,
    justifyContent: 'space-between',
    // borderWidth: 0.5
  },
  inputStyle: {
    height: 38,
    borderBottomWidth: 0.5,
    width: 0.6 * width,
    padding: 0,
    borderColor: '#000'
  },
  textStyle: {
    lineHeight: 38
  }
});