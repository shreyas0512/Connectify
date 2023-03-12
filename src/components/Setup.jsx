import React from "react";

const Setup = () => {
  const [name, setName] = React.useState("Swetha");
  return (
    <div className="h-screen w-screen bg-bgcolor flex flex-col items-start bg-repeat-y overflow-scroll">
      <div className="ml-48 w-[63rem]">
        <div className="text-4xl font-bold text-green self-start  mt-12">
          Hi {name},<br /> Let's setup your account...
        </div>
        <div className="bg-white mt-8 w-12/12 h-[22rem] rounded-md shadow-md">
          <div className="ml-48 ">
            <div className="text-[#444444] text-3xl font-semibold pt-4">
              Share something about yourself...
            </div>
            <div className="text-[#444444] text-xl font-regular pt-4">
              about
            </div>
            <input
              type="text"
              className="w-9/12 h-32 bg-[#f0f0f0] border-2 border-gray-200 p-2 rounded-md  focus:outline-none focus:border-green shadow-[inset_0px_4px_10px_-1px_rgba(169,169,169,0.1),inset_0px_-4px_4px_rgba(194,194,194,0.1)]"
            />
            <div className="text-[#444444] text-xl font-regular pt-4">
              Interests
            </div>
            <input
              type="text"
              className="w-9/12 h-12 bg-[#f0f0f0] border-2 border-gray-200 p-2 rounded-md  focus:outline-none focus:border-green shadow-[inset_0px_4px_10px_-1px_rgba(169,169,169,0.1),inset_0px_-4px_4px_rgba(194,194,194,0.1)]"
            />
          </div>
        </div>
        <div className="bg-white mt-12  w-12/12 h-[22rem] rounded-md shadow-md flex flex-col items-center">
          <div className="pt-4 text-green font-bold text-3xl  ">
            Let’s get you going by connecting!
          </div>
          <input
            type="text"
            className=" w-7/12 h-12 mt-8 bg-[#f3f2f2] border-0 border-gray-200 p-2 rounded-md  focus:outline-none focus:border-green shadow-md text-xl font-light"
            placeholder="search for users"
          />
        </div>
        <div className="bg-green p-2 mt-8 w-[12rem] ml-[26rem] pl-8 mb-8 rounded-md hover:bg-white hover:text-green hover:border-green border-2 cursor-pointer transition font-bold text-2xl text-white">
          Go to Feed
        </div>
      </div>
    </div>
  );
};

export default Setup;
