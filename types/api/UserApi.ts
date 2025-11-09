export interface UserApi {
    "@id": number,
    "@type": string,
    id: number,
    email: string,
    roles: string[],
    username: string,
    createdAt: string,
    firstname: string,
    lastname: string,
    profilePictureUrl: string
    phone: string,
    emailVerified: boolean,
    buildings: string[]
}