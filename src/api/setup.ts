import express from 'express';
import cors from 'cors';
import { Api } from "./api";

Api.use(cors({ credentials: true, origin: '*' }))


Api.use(express.json({ inflate: false, limit: '10mb' }))
// Api.use(express.urlencoded({ extended: false }))