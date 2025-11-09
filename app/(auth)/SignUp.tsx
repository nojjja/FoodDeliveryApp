import { Text, View,Button } from 'react-native'
import {router} from 'expo-router'
const SignUp = () => {
  return (
    <View>
      <Text>SignUp</Text>
            <Button title="Sign Up" onPress={() => router.push( href "/SignIn")}/>
    </View>
  )
}

export default SignUp