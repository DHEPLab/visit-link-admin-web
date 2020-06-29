import React from 'react';

export default function Media({ name, value, onChange }) {
  const nameType = `${name}.type`;
  const nameFile = `${name}.file`;
  const nameAlt = `${name}.alt`;

  return (
    <div>
      <input name={nameType} value={value.type} onChange={onChange} placeholder="类型" />
      <input name={nameFile} value={value.file} onChange={onChange} placeholder="上传" />
      <input name={nameAlt} value={value.alt} onChange={onChange} placeholder="Alt" />
    </div>
  );
}
