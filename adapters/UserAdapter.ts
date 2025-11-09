import { UserApi } from "@/types/api/UserApi";
import { User } from "@/types/user";

export class UserAdapter {
    static fromApi(user: UserApi): User {
        return {
            id: user.id,
            username: user.username,
            email: user.email,
            roles: user.roles,
            firstname: user.firstname,
            isEmailVerified: user.emailVerified,
            lastname: user.lastname
        }
    }
}