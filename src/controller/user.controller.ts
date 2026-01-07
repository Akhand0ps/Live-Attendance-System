import { Request, Response } from 'express'
import { authSchema, loginSchema } from '../schemas/auth.schema.js'
import { User } from '../models/user.model.js'
import { hashPass } from '../utils/hash.pass.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

export const register = async (req: Request, res: Response): Promise<void> => {
  const result = authSchema.safeParse(req.body)
  // console.log(result);

  if (!result.success) {
    res.status(422).json({ success: false, error: 'Invalid request Schema' })
    return
  }
  try {
    const { name, email, password, role } = result.data
    const userExist = await User.findOne({ email })

    if (userExist) {
      res.status(403).json({ success: false, error: 'Email already exists' })
      return
    }

    const hashedPass = await hashPass(password)
    console.log(hashedPass)

    // password = hashedPass;

    const data = new User({
      name: name,
      email: email,
      password: hashedPass,
      role: role,
    })
    await data
      .save()
      .then(() => {
        console.log('successfully saved')
      })
      .catch((err) => {
        throw new Error('Erro came in saving user info')
        console.log('err: ', err)
      })

    console.log(data)
    res.status(201).json({ success: true, data })
    return
  } catch (err: unknown) {
    res.status(500).json({ success: false, error: 'Internal Server Error' })
  }
}

export const login = async (req: Request, res: Response): Promise<void> => {
  const result = loginSchema.safeParse(req.body)
  // console.log(result);

  if (!result.success) {
    res.status(422).json({ success: false, error: 'Invalid request Schema' })
    return
  }

  try {
    const { email, password } = result.data
    const userExist = await User.findOne({ email })
    if (!userExist) {
      res.status(404).json({ success: false, error: 'User not found' })
      return
    }

    const verifyUser = await bcrypt.compare(password, userExist.password)
    if (!verifyUser) {
      res
        .status(400)
        .json({ success: false, error: 'Invalid email or password' })
      return
    }

    const token = jwt.sign(
      { id: userExist._id, role: userExist.role },
      process.env.JWT_SECRET!,
      { expiresIn: '1d' },
    )
    console.log('token: ', token)

    const data = { token }
    res.status(200).json({
      success: true,
      data,
    })
    return
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).json({ success: false, error: err.message })
    } else {
      console.error('err came in login')
    }
  }
}

export const me = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user.id
    console.log(userId)
    const data = await User.findById(userId).select('-password')
    if (!data) {
      res.status(404).json({ success: false, error: 'User not found' })
      return
    }

    res.status(200).json({
      success: true,
      data,
    })
    return
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).json({ success: false, error: err.message })
    }
  }
}
