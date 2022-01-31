import {
	SimpleGrid,
	Image,
	Box,
	Text,
	Heading,
	Flex,
	PinInput,
	PinInputField,
	HStack,
	VStack,
	useDisclosure,
} from '@chakra-ui/react';
import { Step, Steps, useSteps } from 'chakra-ui-steps';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { BiSearchAlt } from 'react-icons/bi'
import * as yup from 'yup';

import { NavigationBar } from '../styles';
import { Login } from '../components/Login';

import { Highlight } from '@/components/Utils';
import { Link, Button } from '@/components/Elements';
import { Field, Checkbox } from '@/components/Form';

export function AccountRecovery() {
	const [stepState, setStepState] = useState(undefined);
	const [isArtist, setIsArtist] = useState(false);

	const { nextStep, prevStep, _, activeStep } = useSteps({
		initialStep: 0,
	});

	useEffect(() => {
		console.log(isArtist);
	}, [isArtist]);

	return (
		<SimpleGrid>
			<Box margin="auto" paddingTop="10px">
				<NavigationBar>
					<Link to="/">
						<Image src="/assets/images/app-icon-transparent.png" alt="Ongaku Logo" height="100px" maxWidth="150px" />
					</Link>
				</NavigationBar>
			</Box>

			<Box align="center">
				<Heading marginTop="10px">Recover the <Highlight>access</Highlight> to your account</Heading>
				<Text
					textAlign="center"
					padding="15px"
					width={['90%', '70%', '50%', '40%']}
				>
					We'll walk you through the account recovery process, the only
					thing you need is <Highlight>access to the email</Highlight> associated with the account
				</Text>
			</Box>
			<Steps
				state={stepState}
				activeStep={activeStep}
				colorScheme="pink"
				padding="30px 20px 50px 30px"
				size="md"
				orientation="horizontal"
				responsive={false}
			>
				<Step label="Search Email">
					<Box {...BOX_PROPS}>
						<FirstStep
							nextStep={nextStep}
							prevStep={prevStep}
							setStepState={setStepState}
							isArtist={isArtist}
							setIsArtist={setIsArtist}
						/>
					</Box>
				</Step>
				<Step label="Enter Verification Code">
					<Box {...BOX_PROPS}>
						<SecondStep
							nextStep={nextStep}
							prevStep={prevStep}
							setStepState={setStepState}
							isArtist={isArtist}
						/>
					</Box>
				</Step>
				<Step label="Change Password">
					<Box {...BOX_PROPS}>
						<ThirdStep
							nextStep={nextStep}
							prevStep={prevStep}
							setStepState={setStepState}
							isArtist={isArtist}
						/>
					</Box>
				</Step>
				<Step label="Done">
					<Box {...BOX_PROPS}>
						<FourthStep />
					</Box>
				</Step>
			</Steps>

			<Box margin="auto" paddingTop="40px">
				<Link to="/" variant="gray">
					Go Back
				</Link>
			</Box>
			<Box margin="auto">
				<Image src="/assets/images/home-footer.png" margin="40px 0 20px 0" />
			</Box>
		</SimpleGrid>

	);
}

function FirstStep({ nextStep, prevStep, setStepState, isArtist, setIsArtist }) {
	const {
		register,
		control,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(firstStepSchema),
		defaultValues: {
			email: '',
		},
	});

	const handleIsArtist = () => setIsArtist(!isArtist);

	return (
		<>
			<Heading
				fontSize='3xl'
				margin="30px 20px 20px"
			>
				First, let&apos;s find your account
			</Heading>
			<Box padding='10px 130px'>
				<Field
					type="text"
					name="email"
					label="Email"
					placeholder="joemama@gmail.com"
					error={errors.email}
					register={register}
					variant="gray"
				/>
				<Checkbox
					name="isArtist"
					text="Are you an artist?"
					control={control}
					onChangeHandler={handleIsArtist}
					value={isArtist}
					size="md"
					marginTop="30px"
				/>
				<Button
					type="submit"
					variant="accent"
					rightIcon={<BiSearchAlt size={20} />}
					width="130px"
					margin="30px 0 25px 0"
					borderRadius="xl"
					padding="25px"
				>
					Search
				</Button>
			</Box>
		</>
	);
}

function SecondStep({ nextStep, prevStep, setStepState, isArtist }) {
	const {
		register,
		control,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(secondStepSchema),
		defaultValues: {
			verificationCode: '',
		},
	});

	return (
		<>
			<Heading
				fontSize={['2xl', '2xl', '3xl']}
				margin="30px 20px 20px"
			>
				Second, did you receive a code?
			</Heading>
			<Text maxWidth="700px">Input the 6 digit code sent to *****ma@gmail.com</Text>
			<Box padding={['10px 20px', '10px 100px']}>

				<HStack margin={["10px 0", "15px"]} borderColor="gray">
					<PinInput>
						<PinInputField />
						<PinInputField />
						<PinInputField />
						<PinInputField />
						<PinInputField />
						<PinInputField />
					</PinInput>
				</HStack>

				<Button
					type="submit"
					variant="accent"
					width="130px"
					margin="20px 0 25px 0"
					borderRadius="xl"
					padding="25px"
				>
					Submit
				</Button>
			</Box>
		</>
	);
}

function ThirdStep({ nextStep, prevStep, setStepState, isArtist }) {
	const {
		register,
		control,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(thirdStepSchema),
		defaultValues: {
			password: '',
			passwordConfirmation: '',
		},
	});

	return (
		<>
			<Heading
				fontSize='3xl'
				margin="30px 20px 20px"
			>
				Third and last, change the password
			</Heading>
			<Box padding='10px 130px'>
				<VStack>
					<Field
						type="text"
						name="password"
						label="Password"
						placeholder="************"
						error={errors.password}
						register={register}
						variant="gray"
					/>
					<Field
						type="text"
						name="passwordConfirmation"
						label="Confirm Password"
						placeholder="************"
						error={errors.passwordConfirmation}
						register={register}
						variant="gray"
					/>
				</VStack>
				<Button
					type="submit"
					variant="accent"
					rightIcon={<BiSearchAlt size={20} />}
					width="130px"
					margin="30px 0 25px 0"
					borderRadius="xl"
					padding="25px"
				>
					Search
				</Button>
			</Box>
		</>
	);
}

function FourthStep() {
	const { isOpen, onOpen, onClose } = useDisclosure();

	return (
		<>
			<Heading
				fontSize='3xl'
				margin="30px 20px 20px"
			>
				<Highlight>Done!</Highlight>
			</Heading>
			<Box padding='10px 10px'>
				<Highlight variant="gray">Welcome back, now you can access and start using Ongaku at it's fullest with your friends and start listening your favorite artist</Highlight>
			</Box>


			<HStack margin="0px 120px 20px" justifyContent="space-between">
				<Button
					variant="accent"
					width="130px"
					margin="30px 0 25px 0"
					borderRadius="xl"
					padding="25px"
					onClick={onOpen}
				>
					Log in
				</Button>
				<Button
					width="130px"
					as={RouterLink}
					to="/"
					margin="30px 0 25px 0"
					borderRadius="xl"
					padding="25px"
				>
					Go Home
				</Button>
			</HStack>
			{isOpen && <Login isOpen={isOpen} onClose={onClose} />}
		</>
	);
}

const firstStepSchema = yup.object({
	email: yup
		.string()
		.email('You must enter a valid email')
		.required('This field is required.'),
});

const secondStepSchema = yup.object({
	verificationCode: yup
		.number()
		.required('This field is required.')
		.positive('You must enter a positive number.')
		.integer('You must enter a whole number.'),
});

const thirdStepSchema = yup.object({
	password: yup
		.string()
		.min(8, 'Minimum eight (8) characters.')
		.required('This field is required.'),
	passwordConfirmation: yup
		.string()
		.required('This field is required.')
		.oneOf([yup.ref('password'), null], 'Both passwords must match.'),
});

const BOX_PROPS = {
	borderWidth: "1px",
	borderColor: "gray",
	borderRadius: "2xl",
	maxWidth: "40%",
	margin: "auto",
	textAlign: "center",
}