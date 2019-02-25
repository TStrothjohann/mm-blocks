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
const { Fragment } = wp.element;

const {
    MediaUpload,
    MediaUploadCheck,
    URLInput,
    BlockControls,
    AlignmentToolbar
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
registerBlockType( 'mm/showcase', {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	title: __( 'MM Showcase' ), // Block title.
	icon: 'money', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
	category: 'mm', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	keywords: [
		__( 'Medium Magazin' ),
		__( 'Showcase' ),
		__( 'Abo' ),
	],

	attributes: {
		linkBuyPrint: {
			type: 'string',
			default: 'https://shop.oberauer.com/medien/medium-magazin/'
		},
		linkBuyEpaper: {
			type: 'string',
			default: 'https://shop.oberauer.com/medien/medium-magazin/'
		},
		linkSubscriptions: {
			type: 'string',
			default: 'https://shop.oberauer.com/medien/medium-magazin/'
		},
		linkTableOfContents: {
			type: 'string'
		},
		statusOfInput: {
			type: 'string'
		},
		alignment: {
            type: 'string',
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

        function onChangeAlignment( newAlignment ) {
            props.setAttributes( { alignment: newAlignment } );
        }

        return (
        		<Fragment>
	        		<BlockControls>
	                    <AlignmentToolbar
	                        value={ props.attributes.alignment }
	                        onChange={ onChangeAlignment }
	                    />
	                </BlockControls>
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
	    		</Fragment>
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
				  	<a data-isset={ props.attributes.statusOfInput } className="list-group-item list-group-item-action linkTableOfContents" href={ props.attributes.linkTableOfContents } >
					  	<span className="dashicons dashicons-list-view"></span> Inhaltsverzeichnis (PDF)
				  	</a>
				)
			}else{
				return null;
			}
		}

		function BuyPrint(){
				return (
					<a className="list-group-item list-group-item-action" href={ props.attributes.linkBuyPrint ? props.attributes.linkBuyPrint : props.attributes.linkBuyPrint.default }>
						<span className="dashicons dashicons-book"></span> Heft kaufen
					</a>
				)
		}

		function BuyEpaper(){
			if (props.attributes.linkBuyEpaper !== "") {
				return(
					<a className="list-group-item list-group-item-action" href={ props.attributes.linkBuyEpaper ? props.attributes.linkBuyEpaper : props.attributes.linkBuyEpaper.default }>
					<span className="dashicons dashicons-tablet"></span> Epaper kaufen
					</a>
				)
			}else{
				return null;
			}			
		}

		function Abo(){
			if (props.attributes.linkSubscriptions !== "") {
				return( 	
				  	<a className="list-group-item list-group-item-action" href={ props.attributes.linkSubscriptions ? props.attributes.linkSubscriptions : props.attributes.linkSubscriptions.default }>
					  	<span className="dashicons dashicons-money"></span> Abos
				  	</a>				  
				)
			}else{
				return null;
			}			
		}

		function translateAlignmentToStyle(alignment) {
			switch(alignment){
				case 'left':
					return "list-group col-12 col-md-6 float-left my-2 mr-2"
					break;
				case 'right':
					return "list-group col-12 col-md-6 float-right my-2 ml-2"
					break;
				default:
					return "list-group col-12 my-2"
				break;
			}
		}

		// ToDo: make the links a property of each component instead of taking them from props in scope
		return (
			<div className={ translateAlignmentToStyle( props.attributes.alignment ) }>				  
			  <TableOfContents />
			  <BuyPrint />
			  <BuyEpaper />
			  <Abo />
			</div>
		);
	},
} );
