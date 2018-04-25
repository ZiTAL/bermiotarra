<?php include('header.tpl'); ?>
<form method="get">
<label>Bilatzailie: </label><input type="text" name="search" value="<?php echo $search; ?>"/>
<input type="submit" />
</form>
<?php echo $search_results; ?>
<?php include('footer.tpl'); ?>
