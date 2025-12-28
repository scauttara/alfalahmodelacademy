import User from './user.model.js'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'


export const createUser = async (req, res) => {
    try {
        const { name, mobile, email, passowrd, role, status } = req.body
        const existingUser = await User.findOne({ $or: [{ email }, { mobile }] })
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email or mobile already exists' })

        }
        const saltRounds = parseInt(process.env.SALT_ROUNDS)
        const hashedPassword = await bcryptjs.hash(passowrd, saltRounds)
        const newUser = new User({
            name, mobile, email, password: hashedPassword, role, status
        })
        await newUser.save()
        res.status(201).json({ message: 'User created successfully', user: newUser })

    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error })
    }
}

export const getUser = async (req, res) => {
    res.send(' Get User')
}

export const updateUser = async (req, res) => {
    res.send(' Update User')
}

export const deleteUser = async (req, res) => {
    res.send(' Delete User')

}

export const testUser = async (req, res) => {
    res.send(' Test User')

}