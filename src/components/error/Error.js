import errImg from './error.gif'

const ErrorMessage = () => {
	return (
		<img 
			alt='error' 
			src={errImg}
			style={{display: 'block', width: '250px', height: '250px', objectFit: 'contain', margin: '0 auto'}}/>
	)
}

export default ErrorMessage;