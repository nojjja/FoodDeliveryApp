import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import { signIn } from "@/lib/appwrite";
import useAuthStore from "@/store/auth.store";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Alert, Text, View } from 'react-native';

const SignIn = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form, setForm] = useState({ email: '', password: '' });

    // Получаем функцию обновления состояния авторизации
    const { fetchAuthenticatedUser } = useAuthStore();

    const submit = async () => {
        const { email, password } = form;

        if(!email || !password) {
            Alert.alert('Error', 'Please enter valid email address & password.');
            return;
        }

        setIsSubmitting(true);

        try {
            // 1. Создаём сессию в Appwrite
            await signIn({ email, password });

            // 2. Обновляем Zustand, чтобы store знал о текущем пользователе
            await fetchAuthenticatedUser();

            // 3. Навигация на главный экран
            router.replace('/');
        } catch(error: any) {
            Alert.alert('Error', error?.message || 'Something went wrong');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <View className="gap-10 bg-white rounded-lg p-5 mt-5">
            <CustomInput
                placeholder="Enter your email"
                value={form.email}
                onChangeText={(text) => setForm((prev) => ({ ...prev, email: text }))}
                label="Email"
                keyboardType="email-address"
            />
            <CustomInput
                placeholder="Enter your password"
                value={form.password}
                onChangeText={(text) => setForm((prev) => ({ ...prev, password: text }))}
                label="Password"
                secureTextEntry={true}
            />

            <CustomButton
                title="Sign In"
                isLoading={isSubmitting}
                onPress={submit}
            />

            <View className="flex justify-center mt-5 flex-row gap-2">
                <Text className="base-regular text-gray-100">
                    Don't have an account?
                </Text>
                <Link href="/(auth)/SignUp" className="base-bold text-primary">
                    Sign Up
                </Link>
            </View>
        </View>
    )
}

export default SignIn