"use client";
import React, { type FC } from "react";
export const CommentPreview: FC<{ html: string }> = ({ html }) => {
	return <div dangerouslySetInnerHTML={{ __html: html }} />;
};
