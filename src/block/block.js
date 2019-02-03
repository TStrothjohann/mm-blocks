/**
 * BLOCK: my-block
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

//  Import CSS.
import './style.scss';
import './editor.scss';

const { __ } = wp.i18n; // Import __() from wp.i18n
const { registerBlockType } = wp.blocks; // Import registerBlockType() from wp.blocks
const { 
	Button
} = wp.components;

const {
    MediaUpload,
    MediaUploadCheck,
    URLInput
} = wp.editor;
/**
 * Register: aa Gutenberg Block.
 *
 * Registers a new block provided a unique name and an object defining its
 * behavior. Once registered, the block is made editor as an option to any
 * editor interface where blocks are implemented.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType( 'cgb/block-my-block', {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	title: __( 'my-block - CGB Block' ), // Block title.
	icon: 'shield', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
	category: 'common', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	keywords: [
		__( 'my-block — CGB Block' ),
		__( 'CGB Example' ),
		__( 'create-guten-block' ),
	],

	attributes: {
		linkBuyPrint: {
			type: 'string',
			// selector: 'a.linkBuyPrint',
			// source: 'attribute',
			// attribute: 'href'
		},
		linkBuyEpaper: {
			type: 'string',
			// selector: 'a.linkBuyEpaper',
			// source: 'attribute',
			// attribute: 'href'
		},
		linkSubscriptions: {
			type: 'string',
			// selector: 'a.linkSubscriptions',
			// source: 'attribute',
			// attribute: 'href'
		},
		linkTableOfContents: {
			type: 'string',
			// selector: 'a.linkTableOfContents',
			// source: 'attribute',
			// attribute: 'href'
		},
		statusOfInput: {
			type: 'string',
			// selector: 'a.linkTableOfContents',
			// source: 'attribute',
			// attribute: 'data-isset'
		}
	},

	/**
	 * The edit function describes the structure of your block in the context of the editor.
	 * This represents what the editor will render when the block is used.
	 *
	 * The "edit" property must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 */
    edit: function( props ) {	

   	    function onLinkTableOfContentsChange(pdf) {
            if (pdf.url) {
            	props.setAttributes({
	                linkTableOfContents: pdf.url,
	                statusOfInput: 'dashicons-yes' 
            	})
            }else{
            	props.setAttributes({
	                linkTableOfContents: "",
	                statusOfInput: 'dashicons-no' 
            	})
            }

        }

        return (
        		<div className={props.className}>
		           	<div className="components-placeholder__label">
		           		Medium Magazin Promo Links
		           	</div> 
	        		<MediaUploadCheck>
				        <MediaUpload
				            label="Inhaltsverzeichnis"
				            onSelect={ onLinkTableOfContentsChange }
				            allowedTypes={ ["application/pdf"] }
				            value={props.attributes.linkTableOfContents}
				            render={({ open }) => (
				                <div>
					                <Button className="is-button is-default" onClick={open}>
					                    Inhaltsverzeichnis hochladen (PDF)
					                    <span className={ "dashicons " + props.attributes.statusOfInput } ></span>
					                </Button> 
					            </div>
				            )}
				        />
				    </MediaUploadCheck>
		            <br />
		            <div className="components-base-control components-base-control__field">
			            <label className="components-base-control__label">Abo Link</label>
			            <URLInput
							value={ props.attributes.linkSubscriptions }
							onChange={ ( url ) => props.setAttributes( { linkSubscriptions: url } ) }
						/>
					</div>
		            <div className="components-base-control components-base-control__field">
			            <label className="components-base-control__label">Heft kaufen Link</label>
			            <URLInput
							value={ props.attributes.linkBuyPrint }
							onChange={ ( url ) => props.setAttributes( { linkBuyPrint: url } ) }
						/>
					</div>
		            <div className="components-base-control components-base-control__field">
			            <label className="components-base-control__label">Epaper Link</label>
			            <URLInput
							value={ props.attributes.linkBuyEpaper }
							onChange={ ( url ) => props.setAttributes( { linkBuyEpaper: url } ) }
						/>
					</div>
	    		</div>
        );
    },

	/**
	 * The save function defines the way in which the different attributes should be combined
	 * into the final markup, which is then serialized by Gutenberg into post_content.
	 *
	 * The "save" property must be specified and must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 */
	save: function( props ) {
		
		function TableOfContents(){
			if (props.attributes.linkTableOfContents) {
				return (
					<li className="list-group-item">
					  	<span className="dashicons dashicons-list-view"></span>
					  	<a data-isset={ props.attributes.statusOfInput } className="linkTableOfContents" href={ props.attributes.linkTableOfContents } >
						  	Inhaltsverzeichnis (PDF)
					  	</a>
					</li>
				)
			}else{
				return null;
			}
		}

		function BuyPrint(){
			if (props.attributes.linkBuyPrint) {
				return (
					<li className="list-group-item">
				  		<span className="dashicons dashicons-book"></span>
				  		<a className="linkBuyPrint" href={ props.attributes.linkBuyPrint }>
					  		Heft kaufen
				  		</a>
				  	</li>					
				)
			}else{
				return null;
			}
		}


		function BuyEpaper(){
			if (props.attributes.linkBuyEpaper) {
				return(
					<li className="list-group-item">
					<span className="dashicons dashicons-tablet"></span>
						<a href={ props.attributes.linkBuyEpaper }>
					  	Epaper kaufen
						</a>
					</li>
				)
			}else{
				return null;
			}			
		}

		function Abo(){
			if (props.attributes.linkSubscriptions) {
				return(
				  <li className="list-group-item">
				  	<span className="dashicons dashicons-money"></span>
				  	<a className="linkSubscriptions" href={ props.attributes.linkSubscriptions }>
					  	Abos
				  	</a>
				  </li>
				)
			}else{
				return null;
			}			
		}

		return (
			<div>
				<ul className="list-group">				  
				  <TableOfContents />
				  <BuyPrint />
				  <BuyEpaper />
				  <Abo />
				</ul>
			</div>
		);
	},
} );
