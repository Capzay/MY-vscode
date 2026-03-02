/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../nls.js';
import { IAction, Separator, toAction } from '../../../base/common/actions.js';
import { IContextMenuService } from '../../../platform/contextview/browser/contextView.js';
import {
	IThemeService,
	IColorTheme,
} from '../../../platform/theme/common/themeService.js';
import { IKeybindingService } from '../../../platform/keybinding/common/keybinding.js';
import {
	CompositeBarAction,
	CompositeBarActionViewItem,
	ICompositeBarColors,
	IActivityHoverOptions,
} from './compositeBarActions.js';
import { ThemeIcon } from '../../../base/common/themables.js';
import { Codicon } from '../../../base/common/codicons.js';
import { IHoverService } from '../../../platform/hover/browser/hover.js';
import { IConfigurationService } from '../../../platform/configuration/common/configuration.js';
import { DisposableStore } from '../../../base/common/lifecycle.js';

export interface ICompositeDropdownItem {
	readonly id: string;
	readonly name: string;
	readonly icon?: string[];
	readonly keybinding?: string;
	readonly pinned: boolean;
}

/**
 * Action that represents the chevron dropdown button
 */
export class CompositeBarDropdownAction extends CompositeBarAction {
	constructor(private readonly showMenu: () => void) {
		super({
			id: 'compositeBar.dropdown',
			name: localize("moreActions", "More Actions"),
			classNames: ThemeIcon.asClassNameArray(Codicon.chevronDown),
		});
	}

	override async run(): Promise<void> {
		this.showMenu();
	}
}

/**
 * View item that renders the dropdown menu with all view containers
 */
export class CompositeBarDropdownActionViewItem extends CompositeBarActionViewItem {
	private dropdownMenuDisposables = this._register(new DisposableStore());

	constructor(
		action: CompositeBarDropdownAction,
		private readonly getDropdownItems: () => ICompositeDropdownItem[],
		private readonly getActiveCompositeId: () => string | undefined,
		private readonly onSelectComposite: (compositeId: string) => void,
		private readonly onTogglePin: (compositeId: string) => void,
		colors: (theme: IColorTheme) => ICompositeBarColors,
		hoverOptions: IActivityHoverOptions,
		@IContextMenuService
		private readonly contextMenuService: IContextMenuService,
		@IThemeService themeService: IThemeService,
		@IHoverService hoverService: IHoverService,
		@IConfigurationService configurationService: IConfigurationService,
		@IKeybindingService keybindingService: IKeybindingService,
	) {
		super(
			action,
			{ icon: true, colors, hasPopup: true, hoverOptions, isTabList: false },
			() => true,
			themeService,
			hoverService,
			configurationService,
			keybindingService,
		);
	}

	showMenu(): void {
		this.dropdownMenuDisposables.clear();

		const items = this.getDropdownItems();
		const activeCompositeId = this.getActiveCompositeId();

		const actions: IAction[] = items.map((item) => {
			const isActive = activeCompositeId === item.id;

			// Main action to open the composite
			const compositeAction = toAction({
				id: item.id,
				label: this.formatLabel(item),
				checked: isActive,
				run: () => this.onSelectComposite(item.id),
			});

			return compositeAction;
		});

		// Add separator before pin actions
		if (actions.length > 0) {
			actions.push(new Separator());
		}

		// Add individual pin/unpin actions for each composite
		items.forEach((item) => {
			const isPinned = item.pinned;
			actions.push(
				toAction({
					id: `${item.id}.togglePin`,
					label: isPinned
						? localize("unpin", "Unpin {0}", item.name)
						: localize("pin", "Pin {0}", item.name),
					run: () => {
						this.onTogglePin(item.id);
						// Don't close menu - let it stay open
					},
				}),
			);
		});

		this.contextMenuService.showContextMenu({
			getAnchor: () => this.container,
			getActions: () => actions,
			getCheckedActionsRepresentation: () => 'radio',
			autoSelectFirstItem: false,
		});
	}

	private formatLabel(item: ICompositeDropdownItem): string {
		let label = item.name;
		if (item.keybinding) {
			label += ` (${item.keybinding})`;
		}
		if (item.pinned) {
			label += ' $(pinned)';
		}
		return label;
	}

	override render(container: HTMLElement): void {
		super.render(container);

		// Add special class for dropdown button
		this.container.classList.add('composite-bar-dropdown');
	}
}
