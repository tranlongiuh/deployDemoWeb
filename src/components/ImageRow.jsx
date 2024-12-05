import React, { memo } from "react";

const ImageRow = memo(({ id, imageSrc, handleEdit, handleDelete }) => {
  return (
    <tr>
      <td>{id}</td>
      <td>
        <img
          src={imageSrc}
          alt="Food"
          className="w-24 h-24"
        />
      </td>
      <td>
        <button
          onClick={() => handleEdit(id)}
          className="bg-blue-500 text-white p-2"
        >
          Edit
        </button>
      </td>
      <td>
        <button
          onClick={() => handleDelete(id)}
          className="bg-red-500 text-white p-2 ml-2"
        >
          Delete
        </button>
      </td>
    </tr>
  );
});

export default ImageRow;
