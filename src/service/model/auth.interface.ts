export interface User {
    id: number;
    account: string;
    email: string;
    name: string;
    avatar: string; // avatar url;
    isAdmin: boolean;
    storedArticles: number[];
    githubId: number;
}

export interface GithubAuthConfig {
    clientId: string;
    redirect: string;
    state: string;
}
