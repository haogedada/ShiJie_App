import React, { Component } from 'react'
import { Text, View, Alert,ScrollView ,RefreshControl} from 'react-native'
import FansAndConcernItem from './FansAndConcernItem';
import { getUserFansList, getUserFollowList } from '../../netWork/api'

export default class FansAndConcernContain extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isRefreshing: false,
    }
    this.onRefresh = this.onRefresh.bind(this)
    this.loadUserFriend = this.loadUserFriend.bind(this)
  }
  //请求数据
  async loadUserFriend() {
    let _followList = await getUserFollowList();
    let _fansList = await getUserFansList();
    if(_followList.code===200&&_fansList.code===200){
      let newFollowList = [];
      let newFansList = []
      _followList.data.forEach(item => {
        newFollowList.push({
          id: item.userId,
          name: item.userNickname,
          signature: item.bardianSign,
          avatar: item.headimgUrl
        })
      });
      _fansList.data.forEach(item => {
        newFansList.push({
          id: item.userId,
          name: item.userNickname,
          signature: item.bardianSign,
          avatar: item.headimgUrl
        })
      });
        this.props.refreshCallBack( newFansList,newFollowList )
        this.setState({ isRefreshing: false })
    }
  }
  // 下拉刷新功能
  onRefresh() {
    // 请求数据
    this.setState({ isRefreshing: true })
    this.loadUserFriend()
  }
  render() {
    const fansAndConcernItem = this.props.data.map((item,index) => {
        return  (<FansAndConcernItem key={index} dataItem={item}/>)
      }) 
    
    return (
    <View><ScrollView
      refreshControl={
        <RefreshControl
          refreshing={this.state.isRefreshing}
          onRefresh={this.onRefresh}
          tintColor="#fff"
          progressBackgroundColor="#fff"
        />}
      >
      {fansAndConcernItem}
      </ScrollView>
      </View>
    )
  }
}
