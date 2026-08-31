import { FC } from 'react';
import QRCode from 'react-qr-code';

const QRCodeTracking: FC<{ url: string }> = ({ url }) => {
	return (
		<div className='w-37'>
			<QRCode value={url} size={150} />
			<p className='text-primary text-center font-mono font-semibold text-sm my-2'>
				Scan to track
			</p>
		</div>
	);
};

export default QRCodeTracking;
