import React from "react";

import { Snackbar, Alert, Typography, Box, IconButton } from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ErrorRoundedIcon from "@mui/icons-material/ErrorRounded";

import { motion } from "framer-motion";

const MotionBox = motion(Box);

export default function AppSnackbar({
	open,
	onClose,

	message = "",
	title,

	severity = "success",

	autoClose = false,

	autoHideDuration = 3000,

	anchorOrigin = {
		vertical: "top",
		horizontal: "center",
	},
}) {
	const severityStyles = {
		success: {
			border: "1px solid rgba(0,255,140,0.18)",
			glow: "0 10px 30px rgba(0,255,140,0.12)",
			accent: "#00d26a",
			icon: <CheckCircleRoundedIcon />,
		},

		error: {
			border: "1px solid rgba(255,0,0,0.18)",
			glow: "0 10px 30px rgba(255,0,0,0.12)",
			accent: "#ff3b3b",
			icon: <ErrorRoundedIcon />,
		},
	};

	const currentStyle = severityStyles[severity] || severityStyles.success;

	return (
		<Snackbar
			open={open}
			onClose={onClose}
			autoHideDuration={autoClose ? autoHideDuration : null}
			anchorOrigin={anchorOrigin}
		>
			<MotionBox
				initial={{
					opacity: 0,
					y: 20,
					scale: 0.96,
				}}
				animate={{
					opacity: 1,
					y: 0,
					scale: 1,
				}}
				transition={{
					duration: 0.22,
				}}
				sx={{
					width: "100%",
				}}
			>
				<Alert
					elevation={0}
					icon={false}
					severity={severity}
					sx={{
						minWidth: 360,

						background:
							"linear-gradient(180deg, rgba(12,12,12,1) 0%, rgba(18,18,18,1) 100%)",

						backdropFilter: "blur(12px)",

						border: currentStyle.border,

						boxShadow: currentStyle.glow,

						borderRadius: "18px",

						padding: "14px 18px",

						color: "white",

						alignItems: "center",

						"& .MuiAlert-message": {
							width: "100%",
						},
					}}
					action={
						<IconButton
							size="small"
							onClick={onClose}
							sx={{
								color: "#cbd5ff",
							}}
						>
							<CloseIcon fontSize="small" />
						</IconButton>
					}
				>
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							gap: 1.5,
						}}
					>
						<Box
							sx={{
								display: "flex",
								alignItems: "center",
								justifyContent: "center",

								width: 42,
								height: 42,

								borderRadius: "12px",

								background: "rgba(255,255,255,0.04)",

								color: currentStyle.accent,
							}}
						>
							{currentStyle.icon}
						</Box>

						<Box
							sx={{
								display: "flex",
								flexDirection: "column",
								gap: 0.3,
							}}
						>
							<Typography
								sx={{
									fontWeight: 700,
									fontSize: "15px",
									color: currentStyle.accent,
								}}
							>
								{title ||
									(severity === "error" ? "Erro" : "Sucesso")}
							</Typography>

							<Typography
								sx={{
									color: "#cbd5ff",
									fontSize: "14px",
								}}
							>
								{message}
							</Typography>
						</Box>
					</Box>
				</Alert>
			</MotionBox>
		</Snackbar>
	);
}
