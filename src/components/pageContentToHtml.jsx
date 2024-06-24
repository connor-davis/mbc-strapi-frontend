import { createSignal, onMount } from "solid-js";

import { apiUrl } from "../apiUrl";

const PageTextToHtml = ({ content }) => {
  const [pageContent, setContent] = createSignal(null);

  onMount(() => {
    const parser = new DOMParser(); // Create a new DOMParser instance.
    const doc = parser.parseFromString(
      content, // Convert the text/html content to html and give it to the parser to convert it to an html element.
      "text/html"
    );

    doc.body.querySelectorAll("img").forEach((imageElement) => {
      if (imageElement instanceof HTMLImageElement) {
        let imageSrcArray = imageElement.src.split("/");
        let indexWhereUploadsIs = 0;

        imageSrcArray.forEach((part, index) => {
          if (part.startsWith("uploads")) indexWhereUploadsIs = index;
        });

        imageSrcArray = imageSrcArray.filter((part, index) => {
          if (index >= indexWhereUploadsIs) return part;
        });

        const imageUrl = imageSrcArray.join("/");

        imageElement.src = apiUrl + "/" + imageUrl;
        imageElement.parentElement.target = "_blank";
      }
    });

    setContent(doc.body);
  });

  return pageContent; // Return the body html element.
};

export default PageTextToHtml;
