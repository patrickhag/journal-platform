import { Button, Html } from "@react-email/components";
import type * as React from "react";



export const NotifiyContributor : React.FC<{ originalAuthor: string, contributor: string, article: string }> = (props) => {
  
	const { article, originalAuthor, contributor } = props;
	return (
		<Html lang="en">
    Hi {contributor}
    You have been added to contributors of {article} by {originalAuthor}
			<Button href={"#"}>You can reject by clicking here.</Button>
		</Html>
	);
}


