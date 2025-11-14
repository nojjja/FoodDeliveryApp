import CustomButton from '@/components/CustomButton';
import CustomInput from '@/components/CustomInput';
import { createUser } from '@/lib/appwrite';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import { Alert, Text, View } from 'react-native';

const SignUp = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const submit = async () => {
    const { name, email, password } = form;

    // Проверка пустых полей
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please enter your name, email & password');
      return;
    }

    setIsSubmitting(true);

    try {
         await createUser({ name, email, password });

      // Навигация после успешной регистрации
      router.replace('/');
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="flex-1 justify-center p-5 bg-gray-50">
      <View className="bg-white rounded-lg p-5 shadow-md gap-5">
        <CustomInput
          placeholder="Enter your full name"
          label="Full Name"
          value={form.name}
          onChangeText={(text) => setForm((prev) => ({ ...prev, name: text }))}
        />
        <CustomInput
          placeholder="Enter your email"
          label="Email"
          keyboardType="email-address"
          value={form.email}
          onChangeText={(text) => setForm((prev) => ({ ...prev, email: text }))}
        />
        <CustomInput
          placeholder="Enter your password"
          label="Password"
          secureTextEntry
          value={form.password}
          onChangeText={(text) => setForm((prev) => ({ ...prev, password: text }))}
        />

        <CustomButton
          title="Sign Up"
          isLoading={isSubmitting}
          onPress={submit}
        />

        <View className="flex-row justify-center items-center gap-2 mt-5">
          <Text className="text-gray-600">Already have an account?</Text>
          <Link href="/(auth)/SignIn" className="text-blue-500 font-bold">
            Sign In
          </Link>
        </View>
      </View>
    </View>
  );
};

export default SignUp;
