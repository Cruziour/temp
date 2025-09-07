// import React, { useState } from 'react';
// import Button from '../../../components/shared/Button/Button';
// import Card from '../../../components/shared/Card/Card';
// import { useDispatch, useSelector } from 'react-redux';
// import { activationService } from '../../../services';
// import { setAuth } from '../../../redux/slice/authSlice';
// import Loader from '../../../components/shared/Loader/Loader';

// const StepAvatar = () => {
//   const dispatch = useDispatch();
//   const { name } = useSelector((state) => state.activateSlice);
//   const [image, setImage] = useState('/images/monkey-avatar.png');
//   const [file, setFile] = useState(null);
//   const [loading, setLoading] = useState(false);
//   // const [unMounted, setUnMounted] = useState(false);

//   const captureImage = (e) => {
//     const uploadedFile = e.target.files[0];
//     if (!uploadedFile) {
//       setFile('/images/monkey-avatar.png');
//     }
//     setFile(uploadedFile);
//     const imageUrl = URL.createObjectURL(file);
//     setImage(imageUrl);
//   };

//   const submit = async () => {
//     if (!file || !name) return;
//     const formData = new FormData();
//     formData.append('name', name);
//     formData.append('avatar', file);
//     setLoading(true);
//     try {
//       const { data } = await activationService(formData);
//       if (data?.auth) {
//         dispatch(setAuth(data));
//       }
//     } catch (error) {
//       console.error(error, 'stepAvatar');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // useEffect(() => {
//   //   return () => {
//   //     setUnMounted(true);
//   //   };
//   // });

//   if (loading) {
//     return <Loader message={`Activation in progress...`} />;
//   }

//   return (
//     <div className="flex justify-center items-center mt-20 container">
//       <Card title={`Okay, ${name}!`} icon={'monkey-emoji'}>
//         <p className="text-sm text-gray-400 text-center pl-7">
//           How's this photo?
//         </p>
//         <div className="flex justify-center items-center mt-4">
//           <div className="w-[110px] h-[110px] border-4 border-blue-800 rounded-full flex items-center justify-center overflow-hidden">
//             <img
//               src={image}
//               alt="avatar"
//               className="h-[90%] w-[90%] object-cover"
//             />
//           </div>
//         </div>
//         <div className="pt-2">
//           <input
//             type="file"
//             accept="image/*"
//             onChange={captureImage}
//             className="hidden"
//             id="avatarInput"
//           />
//           <label
//             htmlFor="avatarInput"
//             className="text-sm text-blue-400 cursor-pointer"
//           >
//             Choose a different photo
//           </label>
//         </div>
//         <div className="flex justify-center mt-2">
//           <Button btnText={`Next`} onClick={submit} />
//         </div>
//       </Card>
//     </div>
//   );
// };

// export default StepAvatar;

import React, { useState, useEffect } from 'react';
import Button from '../../../components/shared/Button/Button';
import Card from '../../../components/shared/Card/Card';
import { useDispatch, useSelector } from 'react-redux';
import { activationService } from '../../../services';
import { setAuth } from '../../../redux/slice/authSlice';
import Loader from '../../../components/shared/Loader/Loader';

const StepAvatar = () => {
  const dispatch = useDispatch();
  const { name } = useSelector((state) => state.activateSlice);

  const [image, setImage] = useState('/images/monkey-avatar.png');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Cleanup the object URL on component unmount or when image changes
  useEffect(() => {
    return () => {
      if (image && image.startsWith('blob:')) {
        URL.revokeObjectURL(image);
      }
    };
  }, [image]);

  const captureImage = (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) {
      setFile(null);
      setImage('/images/monkey-avatar.png');
      return;
    }

    // Create image preview
    const imageUrl = URL.createObjectURL(uploadedFile);
    setImage(imageUrl);
    setFile(uploadedFile);
  };

  const submit = async () => {
    if (!file || !name) return;

    const formData = new FormData();
    formData.append('name', name);
    formData.append('avatar', file);

    setLoading(true);

    try {
      const { data } = await activationService(formData);
      if (data?.auth) {
        dispatch(setAuth(data));
      }
    } catch (error) {
      console.error('Error during activation:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader message={`Activation in progress...`} />;
  }

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
            accept="image/*"
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
          <Button btnText={`Next`} onClick={submit} />
        </div>
      </Card>
    </div>
  );
};

export default StepAvatar;
