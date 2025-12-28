import User from './user.model.js'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
const { SALT_ROUNDS, JWT_SECRET } = process.env
/*

router.get('/', getUser);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.get('/test', testUser);


*/


// USER CONTROLLERS

// Create a new user

export const createUser = async (req, res) => {
    try {
        const { name, mobile, email, password, role, status } = req.body
        const existingUser = await User.findOne({ $or: [{ email }, { mobile }] })
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email or mobile already exists' })

        }
        if (!SALT_ROUNDS) {
            return res.status(500).json({ message: 'SALT_ROUNDS is not defined in environment variables' })
        }
        const saltRounds = parseInt(SALT_ROUNDS) || 10
        const hashedPassword = await bcryptjs.hash(password, saltRounds)
        const newUser = new User({
            name, mobile, email, password: hashedPassword, role, status
        })
        await newUser.save()
        res.status(201).json({ message: 'User created successfully', user: newUser })

    } catch (error) {
        console.error("DEBUG ERROR:", error)
        res.status(500).json({ message: 'Error creating user', error: error.message })
    }
}



// Get a user by ID


export const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password')
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user', error: error.message })
    }
}



// Get all users



export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password')
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error: error.message })
    }
}




// Update a user by ID

export const updateUser = async (req, res) => {
    try {

        const { name, mobile, email, role, status, password } = req.body
        const user = await User.findById(req.params.id)
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        const updates = {}
        if (password) {
            const saltRounds = parseInt(SALT_ROUNDS) || 10
            updates.password = await bcryptjs.hash(password, saltRounds)

        }

        if (email && email !== user.email) {
            const existingUser = await User.findOne({ email })
            if (existingUser) {
                return res.status(400).json({ message: 'User with this email already exists' })
            }
            updates.email = email

        }
        if (mobile && mobile !== user.mobile) {
            const existingUser = await User.findOne({ mobile })
            if (existingUser) {
                return res.status(400).json({ message: 'User with this mobile already exists' })
            }
            updates.mobile = mobile
        }
        if (name) updates.name = name
        if (role) updates.role = role
        if (status) updates.status = status

        const updatedUser = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password')
        res.status(200).json({ message: 'User updated successfully', user: updatedUser })

    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error: error.message })
    }
}



// Delete a user by ID


export const deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id)
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' })
        }
        res.status(200).json({ message: 'User deleted successfully', user: deletedUser })
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error: error.message })
    }

}

export const testUser = async (req, res) => {
    res.status(200).json({ message: 'User controller is working fine. ' })

}