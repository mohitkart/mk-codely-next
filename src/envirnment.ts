const env = process.env as any
const envirnment = {
    app_name: (env.NEXT_PUBLIC_APP_NAME || env.APP_NAME || 'my app').replaceAll(' ', '_'),
    secret_key: env.NEXT_PUBLIC_SEKRET_KEY || env.SEKRET_KEY, api: env.NEXT_PUBLIC_API_URL || env.API_URL,
    chat_api: env.NEXT_PUBLIC_CHAT_API_URL || env.CHAT_API_URL,
    userRoleId: env.NEXT_PUBLIC_USER_ROLE_ID || env.USER_ROLE_ID,
    adminRoleId: env.NEXT_PUBLIC_ADMIN_ID || env.ADMIN_ID,
    frontUrl: env.NEXT_PUBLIC_FRONT_URL || env.FRONT_URL,
    image_path: env.NEXT_PUBLIC_IMAGE_PATH || env.IMAGE_PATH,
    firebase: {
        apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY || env.FIREBASE_API_KEY,
        authDomain: env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || env.FIREBASE_AUTH_DOMAIN,
        projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || env.FIREBASE_PROJECT_ID,
        storageBucket: env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || env.FIREBASE_MESSAGING_SENDER_ID,
        databaseURL: env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || env.FIREBASE_DATABASE_URL,
    },
    email: {
        user: env.NEXT_PUBLIC_EMAIL_USER || env.EMAIL_USER,
        password: env.NEXT_PUBLIC_EMAIL_PASS || env.EMAIL_PASS,
        from: env.NEXT_PUBLIC_EMAIL_FROM || env.EMAIL_FROM,
    }
}

export default envirnment