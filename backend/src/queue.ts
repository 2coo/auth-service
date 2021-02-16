import { config } from 'dotenv'
config()
import Queue from './lib/Queue'

Queue.process()
