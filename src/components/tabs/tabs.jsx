import { children, createSignal } from "solid-js";

const Tabs = (props) => {
  const c = children(() => props.children);
  const [activeIndex, setActiveIndex] = createSignal(0);

  return (
    <div
      class={`flex ${
        !props.vertical && "flex-col gap-2"
      } w-full h-auto`}
    >
      <div
        class={`flex flex-wrap gap-2 ${
          props.vertical && "flex-col"
        }`}
      >
        {props.names.map((name, index) => (
          <div
            class={`px-3 py-2 text-center cursor-pointer bg-gray-800 text-white hover:bg-gray-700 hover:text-lime-100 ${
              !props.vertical && "flex-auto"
            } ${index === activeIndex() && "text-lime-100"}`}
            onClick={() => setActiveIndex(index)}
          >
            {name}
          </div>
        ))}
      </div>
      <div>
        {c().map((child, index) => index === activeIndex() && child)}
      </div>
    </div>
  );
};

export default Tabs;
