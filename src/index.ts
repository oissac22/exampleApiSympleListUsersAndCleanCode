import 'dotenv/config'
import { Api } from './api'



const PORT = Number(process.env.PORT || 4000);



Api.listen(
    PORT,
    () =>
        console.table([
            {
                status: 'run',
                port: PORT
            }
        ])
)