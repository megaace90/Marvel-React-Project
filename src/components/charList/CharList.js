// import React, { Component } from 'react/cjs/react.development';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../error/Error';

import './charList.scss';

class CharList extends Component {
	state = {
		chars: [],
		loading: true,
		error: false,
		newItemLoading: false,
		offset: 210,
		charEnded: false
	}

	listItemRefs = []

	setRefs = (el) => {
		this.listItemRefs.push(el);
	}

	focusOnRef = (id) => {
		this.listItemRefs.forEach(item => {
			item.classList.remove('char__item_selected');
		});
		this.listItemRefs[id].classList.add('char__item_selected');
		this.listItemRefs[id].focus();
	}

	marvelService = new MarvelService();
	componentDidMount () {
		this.updateList();
		// this.listItemRef.current.setAttribute('tabindex', 0);
	}

	onLoading = () => {
		this.setState({
			loading: true
		})
	}

	onRequest = (offset) => {
		this.onNewCharsLoading();
		this.marvelService.getAllCharacters(offset)
				.then(this.onCharsLoaded)
				.catch(this.onError)
	}

	onNewCharsLoading = () => {
		this.setState({
			newItemLoading: true
		})
	}

	onCharsLoaded = (newChars) => {
		let ended = false;
		if (newChars.length < 9) {
			ended = true;
		}
		this.setState(({chars, offset}) => ({
			chars: [...chars, ...newChars],
			loading: false,
			error: false,
			newItemLoading: false,
			offset: offset + 9,
			charEnded: ended
		}))
	}

	onError = () => {
		this.setState({
			loading: false,
			error: true
		})
	}

	updateList = () => {
		this.onLoading();
		this.onRequest();
	}

	render () {
		const {chars, loading, error, offset, newItemLoading, charEnded} = this.state;
		const items = chars.map((char, i) => {
			const {id, name, thumbnail} = char;
			let imgStyle = {'objectFit' : 'cover'};
    		if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
        	imgStyle = {'objectFit' : 'unset'};
    		}
			return (
				<li className="char__item" 
						tabIndex={0}
						key={id}
						ref={this.setRefs}
						onClick={() => {
							this.props.onCharSelected(id);
							this.focusOnRef(i);
						}}
						onKeyPress={(e) => {
							if (e.key === ' ' || e.key === "Enter") {
									this.props.onCharSelected(char.id);
									this.focusOnRef(i);
							}
						}}
						>
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
					<button className="button button__main button__long"
									disabled={newItemLoading}
									style={{'display' : charEnded ? 'none' : 'block'}}
									onClick={() => this.onRequest(offset)}>
							<div className="inner">load more</div>
					</button>
			</div>
		)
	}
    
}
CharList.propTypes = {
	onCharSelected: PropTypes.func
}
export default CharList;