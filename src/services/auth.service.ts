import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserRepository } from "../repositories/user.repository";
import { User } from "../entities/User";
import { RegisterDto, LoginDto } from "../dtos/auth.dto";



export class AuthService {

    private useRepo: UserRepository;

    constructor() {
        this.useRepo = new UserRepository();

    }

    async create(registerDto: RegisterDto) {
        const existEmail = await this.useRepo.existsByEmail(registerDto.email);
        const existUsername = await this.useRepo.existsByUsername(registerDto.username);

        if (existEmail) {
            throw new Error(`Ya existe un usuario con el email "${registerDto.email}"`);
        } else if (existUsername) {
            throw new Error(`Ya existe un usuario con el username "${registerDto.username}"`);
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(registerDto.password, salt);

        const user = await this.useRepo.create({
            ...registerDto,
            password: hashedPassword
        })


        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword as User
    }

    async login(loginDto: LoginDto): Promise<{ user: Partial<User>; token: string }> {
        const user = await this.useRepo.findByUserNameWithPassword(loginDto.username);
        if (!user) {
            throw new Error("Credenciales incorrectas");

        }
        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
        if (!isPasswordValid) {
            throw new Error("Credenciales incorrectas");
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role, username: user.username },
            process.env.JWT_SECRET || "secret",
            { expiresIn: "7d" }
        );

        const { password, ...userWithoutPassword } = user

        return {
            user: userWithoutPassword,
            token
        }

    }
    verifyToken(token: string) {
        try {
            return jwt.verify(token, process.env.JWT_SECRET || "secret");
        } catch (error) {
            throw new Error("Token inválido o expirado");

        }
    }

    async getUserById(id:string) : Promise <User>{
        return this.useRepo.findByIdOrFail(id)
    }

    
}