import axios from 'axios';

const requestImages = async (imagerequest, page) => {
  const data = await axios.get(
    `https://pixabay.com/api/?q=${imagerequest}&page=${page}&key=33208131-4d6357c90f666897a60a05f72&image_type=photo&orientation=horizontal&per_page=12`
  );
  console.log(data);
  return data;
};

export default requestImages;
