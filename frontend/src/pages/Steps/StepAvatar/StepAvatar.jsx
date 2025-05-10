import React, { useState } from 'react';
import Button from '../../../components/shared/Button/Button';
import Card from '../../../components/shared/Card/Card';
import { useDispatch, useSelector } from 'react-redux';
import { setAvatar } from '../../../redux/slice/activateSlice';
import { activationService } from '../../../services';

const StepAvatar = () => {
  const dispatch = useDispatch();
  const { name, avatar } = useSelector((state) => state.activateSlice);
  const [image, setImage] = useState('/images/monkey-avatar.png');

  const captureImage = (e) => {
    const file = e.target.files[0];
    // convert file base 64 string using browser api
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function () {
      setImage(reader.result);
      dispatch(setAvatar(reader.result));
    };
  };

  const submit = async () => {
    // do something
    try {
      const { data } = await activationService({ name, avatar });
      console.log(data);
    } catch (error) {
      console.error(error, 'stepAvatar');
    }
  };
  return (
    <div className="flex justify-center items-center mt-20 container">
      <Card title={`Okay, ${name}!`} icon={'monkey-emoji'}>
        <p className="text-sm text-gray-400 text-center pl-7">
          How's this photo?
        </p>
        <div className="flex justify-center items-center mt-4">
          <div className="w-[110px] h-[110px] border-4 border-blue-800 rounded-full flex items-center justify-center overflow-hidden">
            <img
              src={image}
              alt="avatar"
              className="h-[90%] w-[90%] object-cover"
            />
          </div>
        </div>
        <div className="pt-2">
          <input
            type="file"
            onChange={captureImage}
            className="hidden"
            id="avatarInput"
          />
          <label
            htmlFor="avatarInput"
            className="text-sm text-blue-400 cursor-pointer"
          >
            Choose a different photo
          </label>
        </div>
        <div className="flex justify-center mt-2">
          <div>
            <Button btnText={`Next`} onClick={submit} />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StepAvatar;
