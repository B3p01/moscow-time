import Image from "next/image";

function Digit({ digit }) {
  return (
    <div
      className={`relative text-white border-2 border-yellow-200 bg-black rounded font-mono`}
      style={{ width: "12%" }}
    >
      <div className="absolute flex items-center justify-center w-full h-full text-7xl">
        {!isNaN(parseInt(digit)) && <p style={{fontSize: "10vw", transform: `scale(1, 1.5`, fontFamily: 'Roboto Mono' }}>{digit}</p>}
        {isNaN(parseInt(digit)) && digit == "S" && (
          <div className="font-semibold leading-tight text-center" style={{ fontSize: "2.5vw", fontFamily: 'Roboto Mono'}}>
            <p>MSK</p>
            <hr />
            <p>TIME</p>
          </div>
        )}
      </div>
    </div>
  );
}

function Digits({ digits = ["0", "0", "0", "0", "0", "0", "0"] }) {
  return (
    <div
      className="flex justify-between"
      style={{
        width: "85%",
        height: "59.75%",
        marginLeft: "7.4%",
        marginTop: "2.65%",
        // marginRight: "12%",
      }}
    >
      <Digit digit={digits[0]} />
      <Digit digit={digits[1]} />
      <Digit digit={digits[2]} />
      <Digit digit={digits[3]} />
      <Digit digit={digits[4]} />
      <Digit digit={digits[5]} />
      <Digit digit={digits[6]} />
    </div>
  );
}

export default function Clock({ digits }) {
  return (
    <div
      className="relative w-3/4 overflow-hidden bg-gray-700 bg-contain rounded-3xl pb-clock"
      style={{ backgroundImage: `url('/bg.png')` }}
    >
      <div className="absolute w-full h-full">
        <Digits digits={digits} />
      </div>
    </div>
  );
}
