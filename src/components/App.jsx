import React, { Component } from 'react';
import Button from './Button/Button';
import ImageGallery from './ImageGallery/ImageGallery';
import Loader from './Loader/Loader';
import Searchform from './Searchbar/Searchbar';
import requestImages from './Settings/PixabayApi';

class App extends Component {
  state = {
    request: '',
    images: [],
    status: 'idle',
    largeImageURL: '',
    page: 1,
    showBtn: false,
  };

  async componentDidUpdate(prevProps, prevState) {
    const {
      request: prevRequest,
      images: prevImages,
      page: prevPage,
    } = prevState;
    const { request: newRequest, page: newPage } = this.state;

    try {
      if (prevRequest !== newRequest || prevPage !== newPage) {
        this.setState({ status: 'pending' });

        const result = await requestImages(newRequest, newPage);
        const { data: allData } = result;
        const { hits: images } = allData;

        if (images.length === 0) {
          this.setState({ status: 'error' });
        } else {
          this.setState({
            images: [...prevImages, ...images],
            status: 'success',
            showBtn: newPage < Math.ceil(allData.totalHits / 12),
          });
        }
      }
    } catch (error) {
      this.setState({ status: 'error' });
    }
  }

  handleFormSubmit = image => {
    this.setState({
      request: image,
      images: [],
      status: 'idle',
      largeImageURL: '',
      page: 1,
      showBtn: false,
    });
  };

  handleButtonClick = () => {
    this.setState(prevState => {
      return { page: prevState.page + 1 };
    });
  };

  render() {
    const { status, images, page } = this.state;

    return (
      <>
        <Searchform onSubmit={this.handleFormSubmit} />
        {status === 'idle' && (
          <h1 className="message">Start searching for images</h1>
        )}
        {status === 'error' && (
          <h1 className="message">Oops, something went wrong. Try again!</h1>
        )}

        {status === 'pending' && <Loader />}

        <div>
          <ImageGallery images={images} status={status} page={page} />
          {this.state.showBtn && <Button onClick={this.handleButtonClick} />}
        </div>
      </>
    );
  }
}

export default App;
