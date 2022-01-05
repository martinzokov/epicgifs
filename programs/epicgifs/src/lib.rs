use anchor_lang::prelude::*;

declare_id!("BDL2NBBAoeU9ua45dhCBrywzF1Y9XK1EjjMrA13jiQtj");

#[program]
pub mod epicgifs {
    use super::*;
    pub fn start_stuff_off(ctx: Context<StartStuffOff>) -> ProgramResult{
        let base_account = &mut ctx.accounts.base_account;

        base_account.total_gifs = 0;
        
        Ok(())
    }

    pub fn add_gif(ctx: Context<AddGif>, gif_link: String) -> ProgramResult {
        
        if !gif_link.contains("giphy.com") && !gif_link.contains("https://") {
            return Err(ProgramError::InvalidArgument);
        }

        let base_account = &mut ctx.accounts.base_account;
        let user = &mut ctx.accounts.user;

        let item = ItemStruct{
            gif_link: gif_link.to_string(),
            user_address: *user.to_account_info().key,
            votes: 0
        };

        base_account.gif_list.push(item);
        base_account.total_gifs += 1;
        Ok(())
    }

    pub fn update_item(ctx: Context<UpdateItem>, gif_link: String, upvote: bool) -> ProgramResult {
        let base_account = &mut ctx.accounts.base_account;

        let gif_index = base_account.gif_list.iter().position(|r| r.gif_link == gif_link).unwrap();

        let item = &mut base_account.gif_list[gif_index];

        if upvote {
            item.votes += 1;
        } else {
            item.votes -= 1;
        }

        Ok(())
    }
}

#[derive(Accounts)]
pub struct StartStuffOff<'info> {
    #[account(init, payer = user, space = 9000)]
    pub base_account: Account<'info, BaseAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct AddGif<'info> {
    #[account(mut)]
    pub base_account: Account<'info, BaseAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
}

#[derive(Accounts)]
pub struct UpdateItem<'info> {
    #[account(mut)]
    pub base_account: Account<'info, BaseAccount>,
    #[account(mut)]
    pub user: Signer<'info>
}

#[derive(Debug, Clone, AnchorSerialize, AnchorDeserialize)]
pub struct ItemStruct{
    pub gif_link: String,
    pub user_address: Pubkey,
    pub votes: i64,
}

#[account]
pub struct BaseAccount {
    pub total_gifs: u64,
    pub gif_list: Vec<ItemStruct>,
}
