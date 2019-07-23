/*!
 * VisualEditor UserInterface MobileContext class.
 *
 * @copyright 2011-2019 VisualEditor Team and others; see http://ve.mit-license.org
 */

/**
 * UserInterface context that displays inspector full screen.
 *
 * @class
 * @extends ve.ui.LinearContext
 *
 * @constructor
 * @param {ve.ui.Surface} surface
 * @param {Object} [config] Configuration options
 */
ve.ui.MobileContext = function VeUiMobileContext() {
	// Parent constructor
	ve.ui.MobileContext.super.apply( this, arguments );

	// Events
	this.inspectors.connect( this, {
		setup: [ 'toggle', true ],
		teardown: [ 'toggle', false ]
	} );

	// Initialization
	this.$element.addClass( 've-ui-mobileContext' );
	this.$group.addClass( 've-ui-mobileContext-menu' );
	this.surface.getGlobalOverlay().$element.append( this.inspectors.$element );
};

/* Inheritance */

OO.inheritClass( ve.ui.MobileContext, ve.ui.LinearContext );

/* Static Properties */

ve.ui.MobileContext.static.isMobile = true;

ve.ui.MobileContext.static.showDeleteButton = true;

/* Methods */

/**
 * @inheritdoc
 */
ve.ui.MobileContext.prototype.createInspectorWindowManager = function () {
	return new ve.ui.MobileWindowManager( this.surface, {
		factory: ve.ui.windowFactory,
		overlay: this.surface.getGlobalOverlay()
	} );
};

/**
 * @inheritdoc
 */
ve.ui.MobileContext.prototype.toggleMenu = function ( show ) {
	var context = this;
	show = show === undefined ? !this.choosing : !!show;

	if ( show !== this.choosing ) {
		if ( show ) {
			if ( this.hideMenuTimeout ) {
				clearTimeout( this.hideMenuTimeout );
				// Ensure menu is torn down before setting up again.
				ve.ui.MobileContext.super.prototype.toggleMenu.call( this, false );
			}
			// Parent method
			ve.ui.MobileContext.super.prototype.toggleMenu.call( this, true );
		} else {
			this.hideMenuTimeout = setTimeout( function () {
				// Parent method
				ve.ui.MobileContext.super.prototype.toggleMenu.call( context, false );
			}, 100 );
		}
	}

	return this;
};

/**
 * @inheritdoc
 */
ve.ui.MobileContext.prototype.toggle = function ( show ) {
	var deferred,
		context = this;

	show = show === undefined ? !this.visible : !!show;
	if ( show && !this.visible ) {
		deferred = ve.createDeferred();
		setTimeout( function () {
			// Parent method
			ve.ui.MobileContext.super.prototype.toggle.call( context, true );
			context.emit( 'resize' );
			deferred.resolve();
		}, 250 );
		return deferred;
	} else {
		setTimeout( function () {
			context.emit( 'resize' );
		}, 100 );
		// Parent method
		return ve.ui.MobileContext.super.prototype.toggle.call( context, show );
	}
};

/**
 * @inheritdoc
 */
ve.ui.MobileContext.prototype.isInspectable = function () {
	return ve.ui.MobileContext.super.prototype.isInspectable.call( this ) &&
		// Suppress context when surface is active (virtual keyboard)
		this.surface.getView().isDeactivated();
};
