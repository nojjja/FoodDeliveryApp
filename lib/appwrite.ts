import { CreateUserParams, SignInParams } from "@/type";
import { Account, Avatars, Client, Databases, ID, Query } from "react-native-appwrite";

export const appwriteConfig = {
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
    platform: "com.jsm.foodordering",
    databaseId: '6910842700378d0e9f7a',
    userCollectionId: '6918ef7e003d06fe8e55',
};

export const client = new Client()
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId)
    .setPlatform(appwriteConfig.platform);

export const account = new Account(client);
export const databases = new Databases(client);
const avatars = new Avatars(client);

// Регистрация пользователя
export const createUser = async ({ email, password, name }: CreateUserParams) => {
    try {
        // Удаляем все активные сессии текущего пользователя
        try { await account.deleteSessions(); } catch (_) {}

        // Создаём аккаунт
        const newAccount = await account.create(ID.unique(), email, password, name);
        if (!newAccount) throw new Error('Account not created');

        // Создаём сессию нового пользователя
        await account.createEmailPasswordSession(email, password);

        // URL аватара
        const avatarUrl = avatars.getInitialsURL(name);

        // Документ в коллекции
        return await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            {
                email,
                name,
                accountId: newAccount.$id,
                avatar: avatarUrl,
            }
        );
    } catch (e: any) {
        throw new Error(e.message || 'Failed to create user');
    }
    
};

// Вход пользователя
export const signIn = async ({ email, password }: SignInParams) => {
    try {
        // Удаляем текущую сессию текущего пользователя, если она есть
        try {
            await account.deleteSession('current'); 
        } catch (_) {
            // Игнорируем ошибку, если сессии нет
        }

        // Создаём новую сессию
        return await account.createEmailPasswordSession(email, password);
    } catch (e: any) {
        throw new Error(e.message || "Failed to sign in");
    }
};

// Получение текущего пользователя
export const getCurrentUser = async () => {
    try {
        const currentAccount = await account.get();
        if (!currentAccount) throw new Error('No active account');

        const userDoc = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        );

        if (!userDoc.documents || userDoc.documents.length === 0) throw new Error('User not found');

        return userDoc.documents[0];
    } catch (e: any) {
        console.log('getCurrentUser error:', e);
        throw new Error(e.message || 'Failed to get current user');
    }
};
