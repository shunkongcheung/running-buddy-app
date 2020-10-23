import React, {memo} from "react"
import { Alert } from 'reactstrap'

interface HomeProps{

}

const Home:React.FC<HomeProps> = () => {
	
	return (<>
		<Alert color="primary" >Everything is Great</Alert>
					</>);
}

export default memo(Home)
