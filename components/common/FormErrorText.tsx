import { FC } from 'react';

interface FormErrorTextProps {
	message: string;
}

export const FormErrorText: FC<FormErrorTextProps> = ({ message }) => {
	return (
		<>
			{message && (
				<p className='text-sm text-red-500 mt-2'>{String(message)}</p>
			)}
		</>
	);
};

export default FormErrorText;
