import { CreateUserParams, SignInParams } from "@/type";
import { Account, Avatars, Client, Databases, ID, Query } from "react-native-appwrite";

export const appwriteConfig = {
    endpoint: "https://cloud.appwrite.io/v1", // или свой Appwrite endpoint
    projectId: "6910812c0024e40a24a6",             // скопируй из Appwrite -> Settings -> Project ID
    databaseId: "6910842700378d0e9f7a",       // твой ID базы
    userCollectionId: "user",                 // ID коллекции (проверь в консоли Appwrite)
};


export const client = new Client()
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId);

export const account = new Account(client);
export const databases = new Databases(client);
export const avatars = new Avatars(client);

// Создание пользователя
export const createUser = async ({ email, password, name }: CreateUserParams) => {
    try {
        const newAccount = await account.create(ID.unique(), email, password, name);
        if (!newAccount) throw new Error('Account not created');

        await signIn({ email, password });

        const avatarUrl = avatars.getInitialsURL(name);

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
        const session = await account.createEmailPasswordSession(email, password);
        return session;
    } catch (e: any) {
        throw new Error(e.message || 'Failed to sign in');
    }
};

// Получение текущего пользователя
export const getCurrentUser = async () => {
    try {
        const currentAccount = await account.get();
        if (!currentAccount) throw new Error('No current account');

        // Используем Query для фильтрации
        const userDocs = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        );

        if (!userDocs || !userDocs.documents || userDocs.documents.length === 0) {
            throw new Error('User not found');
        }

        return userDocs.documents[0];
    } catch (e: any) {
        console.log(e);
        throw new Error(e.message || 'Failed to get current user');
    }
};
