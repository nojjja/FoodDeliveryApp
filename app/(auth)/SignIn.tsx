
import { Text, View,Button } from 'react-native'
import {router} from 'expo-router'

const SignIn = () => {
  return (
    <View>
      <Text>SignIn</Text>
      <Button title="Sign In" onPress={() => router.push( href"/SignUp")}/>
    </View>
  )
}

export default SignIn