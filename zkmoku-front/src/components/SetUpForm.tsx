// components/SetUpForm.tsx
import React, { useState } from 'react';
import { useClient } from '@/components/Backend/BackendProvider';
import { ZkMokuService } from '@/proto/api_connectweb';
import { asciiToBigInt, bigIntToAscii } from '@/utils/converters';

const SetUpForm: React.FC = () => {
  const [names, setNames] = useState(['', '', '']);
  const [response, setResponse] = useState('');
  const client = useClient(ZkMokuService);

  const handleNumberChange = (index: number, value: string) => {
    setNames((prevNames) => {
      const newNames = [...prevNames];
      newNames[index] = value;
      return newNames;
    });
  };

  const handleAddNumber = () => {
    setNames([...names, '']);
  };

  const handleRemoveNumber = () => {
    if (names.length > 1) {
      setNames(names.slice(0, -1));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitted numbers:', names);
    client
      .setUp({
        ids: names.map((number) => asciiToBigInt(number)),
      })
      .then((resp) => {
        console.log("OK!", resp.toJsonString());
        setResponse(resp.toJsonString());
      }).catch((err) => { console.log(err) })
  };

  return (
    <form onSubmit={handleSubmit}>
      <table>
        <tbody>
          {names.map((name, index) => (
            <tr key={index}>
              <td>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handleNumberChange(index, e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button type="button" onClick={handleAddNumber}>+</button>
      <button type="button" onClick={handleRemoveNumber}>-</button>
      <button type="submit">Submit</button>
      {response && <p>{response}</p>}
    </form>
  );
};

export default SetUpForm;
