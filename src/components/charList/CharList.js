import { Component } from 'react/cjs/react.development';
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../error/Error';

import './charList.scss';
import abyss from '../../resources/img/abyss.jpg';

class CharList extends Component {
	state = {
		chars: [],
		loading: true,
		error: false
	}
	marvelService = new MarvelService();
	componentDidMount () {
		this.updateList();
	}
	onLoading = () => {
		this.setState({
			loading: true
		})
	}
	onCharsLoaded = (chars) => {
		this.setState({
			chars,
			loading: false,
			error: false
		})
	}
	onError = () => {
		this.setState({
			loading: false,
			error: true
		})
	}
	updateList = () => {
		this.onLoading();
		this.marvelService
				.getAllCharacters()
				.then(this.onCharsLoaded)
				.catch(this.onError);
	}
	render () {
		const {chars, loading, error} = this.state;
		const items = chars.map(char => {
			const {id, name, thumbnail} = char;
			let imgStyle = {'objectFit' : 'cover'};
    		if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
        	imgStyle = {'objectFit' : 'unset'};
    		}
			return (
				<li className="char__item" key={id} onClick={() => this.props.onCharSelected(id)}>
						<img src={thumbnail} alt={name} style={imgStyle}/>
						<div className="char__name">{name}</div>
				</li>
			)
		})
		const spinner = loading ? <Spinner/> : null;
		const errorMessage = error ? <ErrorMessage/> : null;
		const content = !(loading || error) ? items : null;
		return (
			<div className="char__list">
					<ul className="char__grid">
						{errorMessage}
						{spinner}
						{content}
					</ul>
					<button className="button button__main button__long">
							<div className="inner">load more</div>
					</button>
			</div>
		)
	}
    
}

export default CharList;