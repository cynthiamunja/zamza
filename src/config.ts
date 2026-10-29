function requireEnv(name: string): string {
    const value=process.env[name];
    if(value=== undefined || value===""){
        throw new Error(`missing required environment variable :${name}`);

    }
    return value;
}

export const config={
    port: Number(process.env.port ?? 3000),
    jwtSecret:requireEnv("JWT_SECRET"),
};
